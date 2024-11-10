import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StatItem from './StatItem';

const StatsContainer = ({ defaultStats }) => {
    
    const stats = [
        {
          title: 'round-1 applications',
          count: defaultStats?.["round-1"] || 0,
          icon: <FaSuitcaseRolling />,
          color: '#647acb',
          bcg: '#e0e8f9',
        },
        {
          title: 'interviews scheduled',
          count: defaultStats?.interview || 0,
          icon: <FaSuitcaseRolling />,
          color: '#647acb',
          bcg: '#e0e8f9',
        },
        {
            title: 'pending application',
            count: defaultStats?.pending || 0,
            icon: <FaSuitcaseRolling />,
            color: '#f59e0b',
            bcg: '#fef3c7',
        },
        {
            title: 'job offered',
            count: defaultStats?.placed || 0,
            icon: <FaCalendarCheck />,
            color: '#65a765',
            bcg: '#e6ffe6',
        },
        {
          title: 'jobs declined',
          count: defaultStats?.rejected || 0,
          icon: <FaBug />,
          color: '#d66a6a',
          bcg: '#ffeeee',
        },
    ];

    return (
        <Wrapper>
            {stats.map((item) => {
                return <StatItem key={item.title} {...item} />;
            })}
        </Wrapper>
    )
}
export default StatsContainer