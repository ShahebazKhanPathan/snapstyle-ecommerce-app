import { Button, Card, CardBody, Divider, Grid, GridItem, HStack, Image, SimpleGrid, Spacer, Text} from "@chakra-ui/react"
import apiClient from "../services/api-client";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import commonStyles from "../utils/commonCSS";
import { useCart } from "../App";

interface Items{
    name: string,
    price: number,
    photo: string,
    _id: string
}

interface Details{
    _id: string;
    uId: string,
    totalPrice: number,
    taxes: number,
    totalAmount: number,
}

const Cart = () => {

    const token = localStorage.getItem("auth-token");
    if (!token) return <Navigate to={"/signin"} />;
    
    const [cartItems, setCartItems] = useState<Items[]>([]);
    const [paymentDetails, setPaymentDetails] = useState<Details>();
    const { setCount }  = useCart();

    const [loadingSpinner] = useState(false);

    const getCartItems = async () => {
        await apiClient.get("/api/cart", { headers: { "auth-token": token } })
            .then(({ data }) => {
                console.log(data);
                setCartItems(data[0].items);
                setPaymentDetails(data[0]);
            })
            .catch((err) => console.log(err.message));
    }

    useEffect(() => {
        getCartItems();
    }, []);

    const removeItem = async (id: string) => {
        await apiClient.delete(
            "/api/cart/"+id,
            { headers: { "auth-token": token } }
        ).then((response) => {
            console.log(response.data);
            setCount(-1);
            getCartItems();
        }).catch((err) => {
            console.log(err.response.data);
        });
    }

    function loadScript(src: string) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    const displayRazorpay = async () => {

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razropay failed to load!!')
            return
        }

        // Create an order
        const result = await apiClient.post(
            "/api/orders/create",
            {
                items: cartItems,
                totalPrice: paymentDetails?.totalPrice,
                totalTaxes: paymentDetails?.taxes,
                totalAmount: paymentDetails?.totalAmount,
                currency: "INR",
                receipt: "receipt#1",
                notes: {}
            },
            {
                headers: { "auth-token": token }
            }
        );
        
        console.log(result);
        const { data } = result;

        // Create options
        const options = {
            key: "rzp_test_0ydM5kNZlWiP4P",
            amount: data.amount,
            currency: data.currency,
            name: "Shahebaz Company",
            description: "Test Transaction",
            order_id: data.id, 
            handler: function (response) {
                apiClient.post(
                    "/api/orders/payment-verify",
                    {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    },
                    { headers: { "auth-token": token } }
                ).then((response) => {
                    if (response.data.status === "ok") {
                        window.location.href = "/orders";
                    }
                    else {
                        alert("Payment verification failed.");
                    }
                }).catch((error) => {
                    console.log("Error", error);
                    alert("Error verifying payment.");
                });
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#3399cc"
            }
        };


        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    if (cartItems.length > 0) {
        return (
            <>
                <Text px={2} fontWeight={500} fontSize={commonStyles.fontSizes}>My Cart ({cartItems.length})</Text>
                <SimpleGrid columns={commonStyles.cart.gridColumns} paddingX={5} spacing={4}>
                        <GridItem colSpan={{ lg: 2, xl: 2 }}>
                            {cartItems.map((item) =>
                                <Card mb={3} key={item._id}>
                                    <CardBody>
                                        <Grid templateColumns="repeat(4, 1fr)">
                                            <GridItem colSpan={3}>
                                                <Link to={"/product?pid=" + item._id} key={item._id}>
                                                    <Text fontSize={commonStyles.fontSizes} fontWeight={600}>{item.name}</Text>
                                                </Link>
                                                <Text fontSize={commonStyles.fontSizes}>Price: ${item.price}</Text>
                                                <Button onClick={() => removeItem(item._id)} leftIcon={<FaTrash />} size="xs" colorScheme="red">Remove</Button>
                                            </GridItem>
                                            <GridItem colSpan={1}>
                                                <Image boxSize={"100px"} objectFit="contain" src={"https://snapstyle.s3.us-west-1.amazonaws.com/" + item.photo} />
                                            </GridItem>
                                        </Grid>
                                    </CardBody>
                                </Card>
                            )
                            }
                        </GridItem>
    
                        <GridItem colSpan={{ lg: 1, xl: 1 }}>
                            <Card>
                                <CardBody>
                                    <Text mb={5} fontWeight={500} fontSize={commonStyles.cart.headingSizes}>Cart</Text>
                                    {cartItems.map((item) => {
                                        return <HStack key={item._id}>
                                            <Text noOfLines={1} fontSize={commonStyles.fontSizes}>{item.name}</Text>
                                            <Spacer />
                                            <Text fontSize={commonStyles.fontSizes} textAlign="right">${item.price.toFixed(2)}</Text>
                                        </HStack>
                                    }
                                    )}
                                    <Divider />
                                    <HStack>
                                        <Text fontSize={commonStyles.fontSizes}>Total Price: </Text>
                                        <Spacer />
                                        <Text fontSize={commonStyles.fontSizes} textAlign="right">${(paymentDetails?.totalPrice.toFixed(2))}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text fontSize={commonStyles.fontSizes}>Taxes: </Text>
                                        <Spacer />
                                        <Text fontSize={commonStyles.fontSizes} textAlign="right">${paymentDetails?.taxes.toFixed(2)}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text fontSize={commonStyles.fontSizes}>Shipping charges: </Text>
                                        <Spacer />
                                        <Text fontSize={commonStyles.fontSizes} textAlign="right">${(2).toFixed(2)}</Text>
                                    </HStack>
                                    <HStack mb={5}>
                                        <Text fontWeight={500} fontSize={commonStyles.cart.headingSizes}>Total: </Text>
                                        <Spacer />
                                        <Text fontWeight={500} fontSize={commonStyles.cart.headingSizes} textAlign="right">${(paymentDetails?.totalAmount + 2).toFixed(2)}</Text>
                                    </HStack>
                                    <Button isLoading={loadingSpinner} onClick={displayRazorpay} width="100%" size={commonStyles.cart.buttonSizes} colorScheme="yellow" type="submit" >Proceed to Pay</Button>
                                </CardBody>
                            </Card>
                        </GridItem>
                </SimpleGrid>
            </>
        );
    }
    else {
        return (
            <>
                <Text px={2} fontSize={commonStyles.fontSizes}>Your cart is empty.</Text>
            </>
        )
    }
    
}

export default Cart;