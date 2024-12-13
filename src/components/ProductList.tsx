import { AbsoluteCenter, Card, CardBody, Center, HStack, Image, SimpleGrid, Skeleton, Text } from "@chakra-ui/react"
import apiClient from "../services/api-client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import commonStyles from "../utils/commonCSS";

interface Product{
    title: string,
    price: number,
    _id: number;
    photo: {
        name: string;
    }
}

const ProductList = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingSkeleton, setSkeleton] = useState(true);
    const [noProductsLabel, setProductsLabel] = useState("");
    
    const getProducts = () => {
        setProductsLabel("");
        apiClient.get("/api/product")
            .then(({ data }) => {
                setSkeleton(false);
                if (data.length == 0) {
                    setProductsLabel("Sorry! No products available right now.");
                }
                else {
                    setProducts(data);
                }
            })
            .catch((err) => {
                setSkeleton(false);
                console.log(err.message)
            });
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            { loadingSkeleton &&
                <SimpleGrid spacing={4} columns={commonStyles.productList.gridColumns}>
                    {commonStyles.productList.skeletons.map((skeleton) =>
                        <Card key={skeleton}>
                            <CardBody>
                                <Skeleton height={commonStyles.productList.boxSizes}></Skeleton>
                                <Skeleton mt={2} height={{ base: "10px", md: "12px", lg: "16px", xl: "16px" }}></Skeleton>
                                <Skeleton mt={2} height={{ base: "10px", md: "12px", lg: "16px", xl: "16px" }}></Skeleton>
                            </CardBody>
                        </Card>
                    )}
                </SimpleGrid>
            }
        
            { products.length > 0 
                ?
                <SimpleGrid spacing={4} columns={commonStyles.productList.gridColumns}>
                    {products.map((product) =>
                    <Link to={"/product?pid="+product._id} key={product._id}>
                        <Card>
                            <CardBody p={{base: "10px", sm: "12px", md: "14px", lg: "16px", xl: "20px"}}>
                                <Center>
                                    <Image boxSize={commonStyles.productList.boxSizes} objectFit="contain" src={"https://snapstyle.s3.us-west-1.amazonaws.com/"+product.photo.name} />
                                </Center>
                                <Text noOfLines={1} mt={3} mb={1} fontSize={commonStyles.fontSizes}>{product.title}</Text>
                                <HStack alignItems="center">
                                    <Text fontWeight={600} fontSize={commonStyles.productList.headingSizes}>${product.price}</Text>
                                    <Text fontSize={commonStyles.fontSizes} color="green">50% off</Text>
                                </HStack>
                            </CardBody>
                        </Card>
                    </Link>
                    )}
                </SimpleGrid>
                :
                <SimpleGrid>
                    <AbsoluteCenter>
                        <Text fontWeight={500}>{noProductsLabel}</Text>
                    </AbsoluteCenter>
                </SimpleGrid>
            }
        </>
    );
}

export default ProductList;