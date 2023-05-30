import React from "react";
import { SignUpForm } from "../../components/SignUpForm";
import styled from "styled-components";
import { AppFooter } from "../../layouts/AppFooter";
import "../../assets/style/CitizenSignUp.css";
const Page = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
`;
const FormContainer = styled.div`
  margin: auto;
  padding: 50px 20px 50px 20px;
  margin-bottom: 15vh;
  border-radius: 16px;
  box-shadow: 10 40px 30px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(4px);
`;

export function SignUp() {
  return (
    <Page id="signup-page">
      <FormContainer id="form-container">
        <SignUpForm />
      </FormContainer>
      <AppFooter></AppFooter>
    </Page>
  );
}
