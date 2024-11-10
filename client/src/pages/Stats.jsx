import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';

const Stats = () => {
    const { defaultStats, monthlyApplications } = useLoaderData();
    return (
        <>
            <StatsContainer defaultStats={defaultStats} />
            {monthlyApplications?.length > 0 && (
                <ChartsContainer data={monthlyApplications} />
            )}
        </>
    )
}

export const loader = async () => {
    try {
      const response = await customFetch.get('/jobs/stats');
      return response.data;
    } catch (error) {
      return error;
    }
};

export default Stats