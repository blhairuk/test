import styled from "styled-components"

export default styled.div`
  height: 360px;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  width: 100%;

  iframe {
    height: 100%;
    left: 0;
    position: absolute;
	  top: 0;
	  width: 100%;
  }
`
