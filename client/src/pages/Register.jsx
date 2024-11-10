import { Link, Form, useNavigation, redirect } from "react-router-dom"
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo } from '../components';
import customFetch from "../utils/customFetch"
import { toast } from 'react-toastify';

const Register = () => {

    const navigate = useNavigation()
    const isSubmitting = navigate.state === "submitting"

    return (
        <Wrapper>
            <Form method="post" className="form">
                <Logo />
                <h4>Register</h4>
                <FormRow type='text' name='name' />
                <FormRow type='text' name='lastName' labelText='last name' />
                <FormRow type='text' name='location' />
                <FormRow type='email' name='email' />
                <FormRow type='password' name='password' />
                <button type='submit' className='btn btn-block' disabled={isSubmitting}>
                    {isSubmitting ? 'submitting...' : 'submit'}
                </button>
                <p>Already a member?
                <Link to='/login' className='member-btn'>
                    Login
                </Link>
                </p>
            </Form>
        </Wrapper>
    )
}

export const action = async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
        await customFetch.post("/auth/register",data)
        toast.success('Registration successful');
        return redirect("/login")
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error   
    }
}

export default Register