import React from 'react';
import styled from 'styled-components';

const MainBody = styled.div`
  display: flex;
  background: linear-gradient(233deg, #A472CB, #5883F2);
  height: 100vh;
`;

const Sidebar = styled.div`
  background-color: #36343A;
  width: 250px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const SidebarLink = styled.a`
  text-decoration: none;
  color: white;
  font-size: 18px;
  display: block;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: ${props => (props.active ? '#5883F2' : 'transparent')};

  &:hover {
    background-color: #5883F2;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  border-radius: 20px;
  border: none;
  outline: none;
`;

const AddButton = styled.button`
  background-color: #36343A;
  padding: 10px 20px;
  border-radius: 30px;
  color: white;
  font-size: 16px;
`;

const PasswordList = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
`;

const PasswordItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

function HomePage() {
  return (
    <MainBody>
      <Sidebar>
        <h1>Password Manager</h1>
        <SidebarLink href="#" active>
          Passwords
        </SidebarLink>
        <SidebarLink href="#">Checkup</SidebarLink>
        <SidebarLink href="#">Settings</SidebarLink>
      </Sidebar>
      <MainContent>
        <Header>
          <SearchInput placeholder="Search passwords" />
          <AddButton>Add</AddButton>
        </Header>
        <PasswordList>
          <PasswordItem>
            <span>emory.edu</span>
            <button>View</button>
          </PasswordItem>
        </PasswordList>
      </MainContent>
    </MainBody>
  );
}

export default HomePage;