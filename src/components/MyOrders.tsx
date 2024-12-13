import { Card, CardBody, Text, Grid, GridItem, Image, SimpleGrid,} from "@chakra-ui/react"
import apiClient from "../services/api-client";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import commonStyles from "../utils/commonCSS";

export interface Info{
    _id: string;
    userName: string;
    email: string;
    mobile: number;
    address: string;
    title: string;
    image: string;
    date: string;
    price: number;
    taxes: number;
    shippingCharges: number;
    total: number
}

interface Order{
    orderId: string,
    orderStatus: string,
    totalPrice: number,
    totalTaxes: number,
    totalAmount: number,
    items: [
        {
            pId: string,
            name: string,
            price: number,
            photo: string
        }
    ]
}

const MyOrders = () => {

    const token = localStorage.getItem("auth-token");
    if (!token) return <Navigate to={"/"}/>;
    const [orders, setOrders] = useState<Order[]>([]);

    const getMyOrders = async() => {
        await apiClient.get(
            "/api/orders",
            { headers: { "auth-token": token } }
        )
            .then(({ data }) => {
                setOrders(data.data);
                console.log(data.data);
            })
            .catch((err) => console.log(err.message));
    }

    useEffect(() => {
        getMyOrders();
    }, []);

    return (
        <>
            <Text px={2} fontWeight={500} fontSize={commonStyles.fontSizes}>My Orders ({orders.length})</Text>
            <SimpleGrid paddingX={5} spacing={4}>
                { orders.map((order) => 
                    <Card>
                        <CardBody>
                            <Text fontSize={commonStyles.fontSizes}>Order ID: {order.orderId}</Text>
                            <Grid templateColumns="repeat(4, 1fr)">
                                <GridItem colSpan={3}>
                                    <Text>Payment Status: {order.orderStatus}</Text>
                                    {
                                        order.items.map((item) =>
                                            <>
                                                <Text>Item name: {item.name}</Text>
                                                <Text>Item price: {item.price}</Text>
                                            </>
                                        )
                                    }
                                </GridItem>
                                <GridItem colSpan={1}>
                                    {
                                        order.items.map((item) => 
                                            <Image boxSize={"100px"} objectFit="contain" src={"https://snapstyle.s3.us-west-1.amazonaws.com/"+item.photo}/>
                                        )
                                    }
                                </GridItem>
                            </Grid>
                            </CardBody>
                    </Card>
                )}
            </SimpleGrid>
        </>
    );
}

export default MyOrders;