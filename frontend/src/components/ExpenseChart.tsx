import { ResponsivePie } from '@nivo/pie';
import { Box, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState } from '../redux/store';

interface PieData {
  id: string;
  label: string;
  value: number;
}

const ExpenseChart = () => {
  const { expenses, loading } = useSelector((state: RootState) => state.expenses);

  const pieData: PieData[] = useMemo(() => {
    return expenses.reduce((acc: PieData[], curr) => {
      const found = acc.find(item => item.id === curr.category);
      if (found) {
        found.value += curr.amount;
      } else {
        acc.push({
          id: curr.category,
          label: curr.category,
          value: curr.amount,
        });
      }
      return acc;
    }, []);
  }, [expenses]);

  if (loading) return <Typography>Loading chart...</Typography>;

  if (!pieData.length) {
    return (
      <Typography align="center" color="textSecondary">
        No expense data to display.
      </Typography>
    );
  }

  //Custom bold color palette
  const customColors = [
    '#FF6B6B', '#6BCB77', '#4D96FF', '#F7C59F',
    '#845EC2', '#FFC75F', '#0081CF', '#B39CD0',
    '#F25F5C', '#00C9A7'
  ];

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Expense Distribution by Category
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsivePie
          data={pieData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={({ id }) => {
            const index = pieData.findIndex(item => item.id === id);
            return customColors[index % customColors.length];
          }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#111"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 56,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#333',
              symbolSize: 18,
              symbolShape: 'circle',
            },
          ]}
        />
      </Box>
    </Paper>
  );
};

export default ExpenseChart;
