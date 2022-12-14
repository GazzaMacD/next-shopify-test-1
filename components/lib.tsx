import styled from "@emotion/styled";
//import { keyframes } from "@emotion/core";
import * as colors from "@/common/js_styles/colors";

const CircleButton = styled.button({
  borderRadius: `30px`,
  padding: `0`,
  width: `40px`,
  height: `40px`,
  lineHeight: `1`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: `pointer`,
});

export { CircleButton };
