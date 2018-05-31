import styled from "styled-components"

export default styled.input`
  background: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  border-top: 1px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-radius: 0;
  font-size: 140%;
  padding: 6px;
  text-align: center;
  transition: border-color 250ms ease-out;

  &:focus {
    background: none;
    box-shadow: none;
    border-bottom: 1px solid #fff;
    border-top: 1px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    color: #fff;
    outline-style: none;
  }
`
