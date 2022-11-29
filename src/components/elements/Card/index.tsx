import React, { ReactNode } from 'react'

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: {}
}
const Card: React.FC<CardProps> = ({ children, className, style }) => {
    return (
        <div
            className={['bg-["rgba(29, 29, 63, 0.893)"] p-5 lg:p-7 m-auto', className, 'shadow'].join(' ')}
            style={style}
        >
            {children}
        </div>
    );
};
export default Card;