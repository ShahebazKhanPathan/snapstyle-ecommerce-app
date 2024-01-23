import { Alert, AlertIcon, Button, Heading, SimpleGrid, Spinner } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

interface User{
    email: String;
    password: String;
}

const SignInForm = () => {

    const token = localStorage.getItem("auth-token");
    const { register, handleSubmit, formState: { errors } } = useForm<User>();
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);

    const onSubmit = (data: User) => {
        setLoader(true);
        axios.post("http://localhost:3000/api/auth", data) 
            .then(({ data }) => {
                localStorage.setItem("auth-token", data);
                setLoader(false);
                window.location.href = "/";
            })
            .catch(({ response }) => {
                setLoader(false);
                setError(response.data);
            });
    }

    if (!token) {
        return (
            <SimpleGrid paddingX={5}>
                {loader && <Spinner className="mb-3"/>}
                {error && <Alert status="error" className="mb-3">
                    <AlertIcon />
                    {error}
                </Alert>}
                <Heading size="lg" mb={4}>Sign In</Heading>
                <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                        <div className="form-group mb-3">
                                <label htmlFor="email" className="label form-label">Email</label>
                                <input {...register("email", { required: "Email is required.", minLength: { value: 5, message: "Email must be at least 5 characters long."} })} id="email" type="text" className="form-control" placeholder="Enter email" />
                                {errors.email && <p className="text-danger">{errors.email?.message}</p>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password" className="label form-label">Password</label>
                            <input {...register("password", { required: "Password is required.", minLength: { value: 8, message: "Password must be at least 8 characters long." } })} id="password" type="text" className="form-control" placeholder="Enter password" />
                            {errors.password && <p className="text-danger">{errors.password?.message}</p>}
                        </div>
                        <Button colorScheme="green" type="submit" >Login</Button>
                    </form>
            </SimpleGrid>
        );
    }
    
    else {
        return <Navigate to={"/"} />
    }
    
}

export default SignInForm;