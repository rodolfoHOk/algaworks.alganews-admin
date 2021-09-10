import { Descriptions, Typography } from 'antd';
import { Payment } from 'rodolfohiok-sdk';

interface PaymentBonusesProps {
  bonuses: Payment.Detailed['bonuses'] | undefined;
}

export default function PaymentBonuses(props: PaymentBonusesProps) {
  return (
    <>
      <Typography.Title level={2}>Bônus</Typography.Title>
      <Descriptions column={1} bordered size="small">
        {props.bonuses?.map((bonus) => {
          return (
            <Descriptions.Item key={bonus.title} label={bonus.title}>
              {bonus.amount.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </>
  );
}
