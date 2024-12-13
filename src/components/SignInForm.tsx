import { Alert, AlertIcon, Button, Card, CardBody, CardHeader, Input, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import { Navigate, useSearchParams } from "react-router-dom";
import apiClient from "../services/api-client";
import { useState } from "react";
import commonStyles from "../utils/commonCSS";

interface User{
    email: String;
    password: String;
}

const SignInForm = () => {

    const token = localStorage.getItem("auth-token");
    const { register, handleSubmit, formState: { errors } } = useForm<User>();
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);
    const [params] = useSearchParams();
    
    const onSubmit = (data: User) => {
        setError('');
        setLoader(true);
        apiClient.post("/api/users/sign-in", data) 
            .then(({ data }) => {
                localStorage.setItem("auth-token", data.token);
                setLoader(false);
                if (params.get('page') == 'payment' && params.get('pid')) {
                    location.href = "/payment?pid="+params.get('pid');
                }
                else if (params.get('page') == 'product' && params.get('pid')) {
                    location.href = "/product?pid="+params.get('pid');
                }
                else {
                    location.href = "/";
                }
            })
            .catch(({ response }) => {
                setLoader(false);
                setError(response.data);
            });
    }

    if (!token) {
        return (
            <SimpleGrid columns={commonStyles.signIn.gridColumns} paddingX={5}>
                <Card py={4}>
                    <CardHeader pt={1} pb={0}>
                        {loader && <Spinner fontSize={commonStyles.fontSizes} className="mb-3"/>}
                        {error && <Alert status="error" className="mb-3">
                            <AlertIcon />
                            {error}
                        </Alert>}
                        <Text fontWeight={600} fontSize={commonStyles.signIn.headingSizes}>Sign In</Text>
                    </CardHeader>
                    <CardBody py={0}>
                        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                            <div className="form-group mb-3">
                                <label htmlFor="email" className="label form-label">Email</label>
                                <Input {...register("email", { required: "Email is required.", minLength: { value: 5, message: "Email must be at least 5 characters long."} })} size={commonStyles.signIn.buttonSizes} id="email" type="text" placeholder="Enter email" />
                                {errors.email && <Text fontSize={commonStyles.fontSizes} color="red">{errors.email?.message}</Text>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password" className="label form-label">Password</label>
                                <Input {...register("password", { required: "Password is required.", minLength: { value: 8, message: "Password must be at least 8 characters long." } })} size={commonStyles.signIn.buttonSizes} id="password" type="password" className="form-control form-control-sm" placeholder="Enter password" />
                                {errors.password && <Text fontSize={commonStyles.fontSizes} color="red">{errors.password?.message}</Text>}
                            </div>
                            <Button size={commonStyles.signIn.buttonSizes} colorScheme="green" type="submit" >Login</Button>
                        </form>
                    </CardBody>
                    </Card>
                
            </SimpleGrid>
        );
    }
    
    else {
        return <Navigate to={"/"} />
    }
    
}

export default SignInForm;