import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  width: 80%;
  min-height: 100vh;
  margin: 2px auto;
  margin-bottom: 100px;
  background-color: #f5f5f1;
  padding-top: 15px;
  padding-bottom: 10px;
`;
export const Heading = styled.text`
  color: #31465f;
  font-size: 1.4rem;
  font-weight: bold;
`;

export const Input = styled.input`
  width: 80%;
  margin: 20px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 5px 0px 5px 5px;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: rgba(49, 70, 95, 0.3);
  }
  :-ms-input-placeholder {
    color: #db7093;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px 5px;
  align-items: center;
  justify-content: center;
`;
export const SubContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 25px 5px;
  align-self: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
  color: #31465f;
  padding: 5px;
`;
export const Wraper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
`;

export const AddImage = styled.div`
  text-align: center;
  padding-left: 80px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const Button = styled.div`
  box-shadow: 0px 10px 20px rgba(101, 41 255, 0.15);
  border-radius: 30px;
  background-color: #e9e9e9;
  width: 120px;
  font-size: 1em;
  color: #31465f;
  margin: 0 auto;
  padding: 0.25em 0em 0.4em;
  border: 0.5px solid #31465f;
  border-radius: 3px;
  justify-content: center;
  align-items: center;
  transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
    cursor: pointer;
  }
`;
export const Signout = styled.button`
  width: 150px;
  overflow: hidden;
  border: none;
`;
