import { Heading, Image, SimpleGrid, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import apiClient from "../services/api-client";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Info } from "./MyOrders";

const Orders = () => {

    const token = localStorage.getItem("admin-auth-token");
    if (!token) return <Navigate to={"/"} />;
    
    const [orders, setOrders] = useState<Info[]>([]);
    let srNo = 0;

    const getOrders = () => {
        apiClient.get("/api/orders/admin", { headers: { "admin-auth-token": token }})
            .then(({ data }) => setOrders(data))
            .catch((err) => console.log(err.message));
    }

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <SimpleGrid paddingX={5}>
            <Heading size="md">Orders ({orders.length})</Heading>
            {orders.length > 0 ? 
                <TableContainer padding={5}>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Sr. no.</Th>
                                <Th>User info</Th>
                                <Th>Product info</Th>
                                <Th>Product photo</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {orders.map((order) => {
                                srNo+=1;
                                return (
                                    <Tr key={srNo}>
                                        <Td>{srNo}</Td>
                                        <Td>
                                            {order.userName} <br />
                                            {order.email} <br />
                                            {order.mobile} <br />
                                            {order.address}
                                        </Td>
                                        <Td>
                                            <Text fontWeight={600}>{order.title}</Text>
                                            Order ID: {order._id} <br />
                                            Order Date: {order.date.substring(0,24)} <br /><br />
                                            Price: ${order.price} <br />
                                            Taxes: ${order.taxes} <br />
                                            Shipping charges: ${order.shippingCharges}
                                            <Text mt={3} fontSize="18px" fontWeight={500}>Bill: ${order.total}</Text>
                                        </Td>
                                        <Td>
                                            <Image height="80px" src={"https://snapstyle.s3.us-west-1.amazonaws.com/"+order.image} />
                                        </Td>
                                    </Tr>);
                                }
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
                :
                <Text>No orders yet.</Text>
            }
        </SimpleGrid>
    );
}

export default Orders;