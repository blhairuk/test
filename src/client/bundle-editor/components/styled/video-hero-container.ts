import styled from "styled-components"

interface Props {
  imageUrl: string,
}

export default styled.div`
  align-items: center;
  background-image: url(${(props: Props) => props.imageUrl});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  height: 200px;
  position: relative;
  justify-content: center;
  z-index: 1;

  &::after {
    background: rgba(0, 0, 0, 0.45);
    bottom: 0;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }
`
