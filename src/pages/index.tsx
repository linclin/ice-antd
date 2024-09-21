import { useData, defineDataLoader, definePageConfig } from 'ice';
import { Line, Pie } from '@ant-design/plots';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
import dayjs from 'dayjs';
import { GetSysData } from '@/services/sys/sys_data';

const { Statistic } = StatisticCard;
export default function Dashboard() {
  const [responsive, setResponsive] = useState(false);
  const today = dayjs().format('YYYY-MM-DD');
  const data = useData();
  const WeekApiCountLine = () => {
  const apidata = data.WeekApiCount || [];
  const apiconfig = {
    data: apidata,
    xField: 'Date',
    yField: 'Count',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };
  return <Line {...apiconfig} />;
  };
  const WeekClientApiCountPie = () => {
  const apidata = data.WeekClientApiCount || [];
  const apiconfig = {
    data: apidata,
    angleField: 'Count',
    colorField: 'ClientIP',
    label: {
      text: 'Count',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };
  return <Pie {...apiconfig} />;
};
  return (
    <>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard
          title="系统运营数据"
          extra={today}
          split={responsive ? 'horizontal' : 'vertical'}
          headerBordered
          bordered
        >
          <ProCard split="horizontal">
            <ProCard split="horizontal">
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    title: '今日接口访问量',
                    value: `${data.ApiCount}`,
                    description: (
                      <Statistic
                        title="接口总访问量"
                        value={data?.AllApiCount}
                        trend="up"
                      />
                    ),
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '今日外部接口访问量',
                    value: `${data.ReqApiCount}`,
                    description: (
                      <Statistic title="外部接口总访问量" value={data.AllReqApiCount} trend="up" />
                    ),
                  }}
                />
              </ProCard>
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    title: '接入系统',
                    value: `${data.SystemCount}`,
                    suffix: '个',
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: 'API接口',
                    value: `${data.RouterCount}`,
                    suffix: '个',
                  }}
                />
              </ProCard>
            </ProCard>
            <StatisticCard
              title="系统接口请求趋势(最近7天)"
              chart={
                <WeekApiCountLine />
              }
            />
          </ProCard>
          <ProCard split="horizontal">
            <StatisticCard
              title="客户端访问接口情况(最近7天)"
              chart={
                <WeekClientApiCountPie />
              }
            />
          </ProCard>
        </ProCard>
      </RcResizeObserver>
    </>
  );
}

export const pageConfig = definePageConfig(() => {
  return {
    title: '工作台',
  };
});

export const dataLoader = defineDataLoader(async () => {
  const data = await GetSysData();
  return data.data;
});