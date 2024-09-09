import { definePageConfig } from 'ice';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Statistic } = StatisticCard;

export default function Dashboard() {
  const [responsive, setResponsive] = useState(false);
  const today = dayjs().format('YYYY-MM-DD');

  return (
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
                  value: 234,
                  description: (
                    <Statistic
                      title="接口总访问量"
                      value="2214134"
                      // trend="down"
                    />
                  ),
                }}
              />
              <StatisticCard
                statistic={{
                  title: '今日外部接口访问量',
                  value: 32,
                  description: (
                    <Statistic title="外部接口总访问量" value="57413398465" trend="up" />
                  ),
                }}
              />
            </ProCard>
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '接入系统',
                  value: '2',
                  suffix: '个',
                }}
              />
              <StatisticCard
                statistic={{
                  title: 'API接口',
                  value: '134',
                  suffix: '个',
                }}
              />
            </ProCard>
          </ProCard>
          <StatisticCard
            title="接口访问走势(周)"
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/_dZIob2NB/zhuzhuangtu.svg"
                width="100%"
              />
            }
          />
        </ProCard>
        <StatisticCard
          title="客户端访问接口情况"
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/qoYmFMxWY/jieping2021-03-29%252520xiawu4.32.34.png"
              alt="大盘"
              width="100%"
            />
          }
        />
      </ProCard>
    </RcResizeObserver>
  );
}

export const pageConfig = definePageConfig(() => {
  return {
    title: '工作台',
  };
});
