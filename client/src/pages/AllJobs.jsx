import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';

const AllJobsContext = createContext()

const allJobsQuery = (params) => {
    const { search, jobStatus, jobType, sort, page } = params;
    return {
      queryKey: [ 'jobs', search ?? '', jobStatus ?? 'all', jobType ?? 'all', sort ?? 'newest', page ?? 1 ],
      queryFn: async () => {
        const { data } = await customFetch.get('/jobs', { params });
        return data;
      },
    };
};

const AllJobs = () => {

    const { searchValues } = useLoaderData();
    const { data } = useQuery(allJobsQuery(searchValues));

    return (
        <AllJobsContext.Provider value={{data, searchValues}}>
            <SearchContainer />
            <JobsContainer />
        </AllJobsContext.Provider>
    )
}

export const loader = (queryClient) => async ({request}) => {
    try {
        const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
        await queryClient.ensureQueryData(allJobsQuery(params));
        const { data } = await customFetch.get("/jobs",{ params })
        return {data,searchValues: { ...params }}
    } catch (error) {
        toast.error(error?.response?.data?.message)
        return error
    }
}

export const useAllJobsContext = () => useContext(AllJobsContext)

export default AllJobs