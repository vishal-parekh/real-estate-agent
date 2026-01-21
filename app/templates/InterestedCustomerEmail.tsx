import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface InterestedCustomerEmailProps {
    name: string;
    email: string;
    propertyAddress: string;
}

export const InterestedCustomerEmail = ({
    name,
    email,
    propertyAddress,
}: InterestedCustomerEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New Lead: {name} is interested in {propertyAddress}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Interested Customer</Heading>
                    <Section style={section}>
                        <Text style={text}>
                            <strong>Name:</strong> {name}
                        </Text>
                        <Text style={text}>
                            <strong>Email:</strong> {email}
                        </Text>
                        <Text style={text}>
                            <strong>Property of Interest:</strong> {propertyAddress}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default InterestedCustomerEmail;

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    paddingTop: '32px',
    paddingBottom: '16px',
};

const section = {
    padding: '24px',
    border: '1px solid #e6ebf1',
    borderRadius: '4px',
    backgroundColor: '#fbfbfc',
};

const text = {
    color: '#525f7f',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
};
