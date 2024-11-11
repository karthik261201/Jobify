import { Link, Form, useNavigation, redirect, useNavigate } from "react-router-dom"
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo } from '../components';
import customFetch from "../utils/customFetch"
import { toast } from 'react-toastify';

const Login = () => {

    const navigate = useNavigate()
    const navigation = useNavigation()
    const isSubmitting = navigation.state === "submitting"

    const loginDemoUser = async () => {
        const data = {
            email: 'test@test.com',
            password: 'secret123',
        };
        try {
            await customFetch.post('/auth/login', data);
            toast.success('Take a test drive');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }   
    }

    return (
        <Wrapper>
            <Form method="post" className='form'>
                <Logo />
                <h4>Login</h4>
                <FormRow type='email' name='email' />
                <FormRow type='password' name='password' />
                <button type='submit' className='btn btn-block'>
                    {isSubmitting ? 'submitting...' : 'submit'}
                </button>
                <button type='button' className='btn btn-block' onClick={loginDemoUser}>explore the app</button>
                <p>Not a member yet?
                <Link to='/register' className='member-btn'>
                    Register
                </Link>
                </p>
            </Form>
        </Wrapper>
    )
}

export const action = (queryClient) => async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
        await customFetch.post("/auth/login",data)
        queryClient.invalidateQueries();
        toast.success('Login successful');
        return redirect("/dashboard")
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error   
    }
}

export default Login