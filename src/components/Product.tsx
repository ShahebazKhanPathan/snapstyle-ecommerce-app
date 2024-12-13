import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Center, Divider, HStack, Image, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import apiClient from "../services/api-client";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { HiMiniCurrencyDollar  } from "react-icons/hi2";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../App";
import commonStyles from "../utils/commonCSS";

export interface Product{
    title: string;
    price: number;
    description: string;
    photo: {
        name: string;
    }
}

const Product = () => {

    const { setCount } = useCart();
    const [params] = useSearchParams();
    const [product, setProduct] = useState<Product>();
    const [loadingSkeleton, setSkeleton] = useState(true);
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState('');
    const id = params.get("pid");

    const getProduct = async (id: string | null) => {
        await apiClient.get("/api/product/" + id)
            .then(({ data }) => {
                setProduct(data);
                setSkeleton(false);
            })
            .catch((err) => {
                setSkeleton(false);
                console.log(err.message);
            });
    }

    const addtoCart = async () => {

        if (!localStorage.getItem("auth-token")) return location.href = "/signin?page=product&pid=" + id;
        setLoader(true);
        
        await apiClient.post(
            "/api/cart",
            {
                pId: id,
                name: product?.title,
                price: product?.price,
                photo: product?.photo.name
            },
            {
                headers: { "auth-token": localStorage.getItem("auth-token") }
            }
        ).then(() => {
            setCount(1);
            setLoader(false);
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 4000);
        })
        .catch((err) => {
            setLoader(false);
            setError(err.message);
            setTimeout(() => {
                setError('');
            }, 4000);
        })
    }

    useEffect(() => {
        getProduct(id);
    }, []);

    return (
        <>
            {loadingSkeleton &&
                <SimpleGrid columns={commonStyles.product.gridColumns} paddingY={2} spacing={5}>
                    <Box px={{ base: 10, sm: 10, md: 8, lg: 2, xl : 2}} >
                        <Skeleton height={commonStyles.product.imageHeight}></Skeleton>
                    </Box>
                    <Box px={{ base: 10, sm: 10, md: 8, lg: 2, xl : 2}}>
                        <Skeleton mb={3} height={{ base: "10px", md: "12px", lg: "16px", xl: "28px" }}></Skeleton>
                        <Skeleton mb={3} height={{ base: "10px", md: "12px", lg: "16px", xl: "24px" }}></Skeleton>
                        <Skeleton mb={3} width="75%" height={{ base: "10px", md: "12px", lg: "140px", xl: "200px" }}></Skeleton>
                        <Skeleton width="60%" mb={3} height={{ base: "10px", md: "12px", lg: "16px", xl: "20px" }}></Skeleton>
                        <Skeleton width="50%" height={{ base: "10px", md: "12px", lg: "16px", xl: "20px" }}></Skeleton>
                    </Box>
                </SimpleGrid>
            }

            {product && 
                <>
                    {alert &&
                        <Alert status="success" mb={4} fontSize={commonStyles.fontSizes}>
                            <AlertIcon />
                            <AlertTitle>Added!</AlertTitle>
                            <AlertDescription>Check your cart.</AlertDescription>
                        </Alert>
                    }
                    {error &&
                        <Alert status="error" mb={4} fontSize={commonStyles.fontSizes}>
                            <AlertIcon />
                            <AlertTitle>Error:</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    }
                    <SimpleGrid columns={commonStyles.product.gridColumns} paddingY={2} paddingX={2} spacing={5}>
                        <Box>
                            <Center>
                                <Image boxSize={commonStyles.product.boxSizes} objectFit="contain" src={"https://snapstyle.s3.us-west-1.amazonaws.com/"+product?.photo.name} />
                            </Center>
                        </Box>
                        <Box>
                            <Text fontWeight={600} fontSize={commonStyles.product.headingSizes} mb={5}>{product?.title}</Text>
                            <Text fontWeight={600} fontSize={commonStyles.fontSizes}>Description</Text>
                            <Text fontSize={commonStyles.fontSizes} textAlign="justify">{product?.description}</Text>
                            <HStack mb={3}>
                                <Text fontSize={commonStyles.product.priceLabelSizes} fontWeight={500}>${product?.price}</Text>
                                <Text fontSize={commonStyles.fontSizes} color="green">50% off</Text>
                            </HStack>
                            <Center>
                                <HStack spacing={5}>
                                    <Button isLoading={loader} onClick={() => addtoCart()} colorScheme="yellow" size={commonStyles.product.buttonSizes} leftIcon={<FaShoppingCart/>}>Add to Cart</Button>
                                    <Link to={"/payment?pid="+id}><Button colorScheme="green" size={commonStyles.product.buttonSizes}  leftIcon={<HiMiniCurrencyDollar size="20px"/>}>Buy Now</Button></Link>
                                </HStack>
                            </Center>
                        </Box>
                    </SimpleGrid>
                    <Divider />
                </>
            }
        </>
    )
}

export default Product;