import { Alert, AlertIcon, Button, Divider, Heading, Input, Select, SimpleGrid, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import apiClient from "../services/api-client";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Photo{
    name: string;
    size: Number;
    type: string;
}

interface Product{
    _id: string;
    title: string;
    category: string;
    price: number;
    photo: Photo[];
    description: string;
}

const Products = () => {

    const token = localStorage.getItem("admin-auth-token");
    if (!token) return <Navigate to={"/"} />;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Product>();
    const [error, setError] = useState('');
    const [alert, setAlert] = useState('');
    const [loader, setLoader] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    const getProducts = () => {
        apiClient.get("/api/product")
            .then((res) => setProducts(res.data))
            .catch((err) => setError(err.message));
    }

    const removeProduct = (id: String) => {
        setLoader(true);
        setAlert("");
        setError("");
        apiClient.delete("/api/product/" + id)
            .then(() => {
                setLoader(false);
                setAlert("Product removed successfully!");
                getProducts();
            })
            .catch((err) => {
                setLoader(false);
                setError(err.message);
            });
    }

    useEffect(() => {
        getProducts();
    }, []);

    const onSubmit = (data: Product) => {
        const image = data.photo;
        data = {
            ...data,
            title: data.title,
            category: data.category,
            price: data.price,
            description: data.description,
            photo: [{ name: data.photo[0].name, size: data.photo[0].size, type: data.photo[0].type }]
        };
        setLoader(true);
        setAlert("");
        setError("");
        apiClient.post("/api/product", data)
            .then((res) => {
                apiClient.put(
                    res.data,
                    image[0],
                    { headers: { "Content-Type": `${data.photo[0].type}`} }
                )
                    .then(() => {
                        setLoader(false);
                        setAlert("Product added successfully!");
                        reset();
                        getProducts();
                    })
                    .catch((err) => {
                        setLoader(false);
                        setError(err.message);
                    });
            })
            .catch((err) => {
                setLoader(false);
                setError(err.message)
            });
    }

    return (
        <SimpleGrid paddingX={5}>
            { loader && <Spinner className="mb-3"/>}
            { error && <Alert status="error" className="mb-3">
                <AlertIcon />
                {error}
            </Alert>}
            { alert && <Alert status="success" className="mb-3">
                <AlertIcon />
                {alert}
            </Alert>}
            <Heading size="lg" mb={4}>Add new product</Heading>
            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <div className="form-group mb-3">
                        <Input type="text" id="title" {...register("title", { required: "Title is required", minLength: { value: 5, message: "Title must be at least 5 characters long."}})} placeholder="Title"/>
                        {errors.title && <p className="text-danger">{errors.title?.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <Select {...register("category", { required: "Category is must"})} id="category" placeholder="Select category">
                            <option value="Fashion">Fashion</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Appliances">Appliances</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Toys">Toys</option>
                            <option value="Eyewear">Eyewear</option>
                        </Select>
                        {errors.category && <p className="text-danger">{errors.category?.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <Input {...register("price", { required: "Price is required.", min: {value: 10, message: "Price must be at least $10"} })} id="price" type="number" placeholder="Price" />
                        {errors.price && <p className="text-danger">{errors.price?.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <Input {...register("description", { required: "Description is required.", minLength: { value: 8, message: "Description must be at least 8 characters long." } })} id="description" type="text" placeholder="Description" />
                        {errors.description && <p className="text-danger">{errors.description?.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <Input {...register("photo", { required: "Photo is required."})} name="photo" className="form-control" id="photo" type="file" />
                        {errors.photo && <p className="text-danger">{errors.photo?.message}</p>}
                    </div>
                    <Button colorScheme="green" type="submit" >Submit</Button>
            </form>
            <Divider mt="30px"/>
            <Heading size="lg">Products</Heading>
            {products.length>0 ? 
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Category</Th>
                                <Th>Price</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            { products.map((product) =>
                                <Tr key={product._id}>
                                    <Td>{product.title}</Td>
                                    <Td>{product.category}</Td>
                                    <Td>{product.price}</Td>
                                    <Td><Button onClick={() => removeProduct(product._id)} colorScheme="red" size="sm">Remove</Button></Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
                :
                <Text>No products added yet.</Text>
            }
        </SimpleGrid>
    );
}

export default Products;