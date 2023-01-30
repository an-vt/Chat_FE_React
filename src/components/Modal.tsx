import { UilTimes } from "@iconscout/react-unicons";
import { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import Portal from "./Portal";

interface Props {
  title?: string;
  visible: boolean;
  onClose: any;
  children: ReactNode;
}

const Content = styled.div`
  width: 450px;
  background-color: #000;
  border-radius: 10px;
  position: relative;

  .title {
    padding-top: 20px;
    text-align: center;
    color: white;
  }

  .icon-close {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
`;

function Modal({ title = "", visible, onClose, children }: Props) {
  return (
    <CSSTransition in={visible} timeout={250} classNames="zoom" unmountOnExit>
      {(status) => (
        <Portal
          visible={status !== "exited"}
          onClose={onClose}
          bodyStyle={{ transition: "all 250ms" }}
        >
          <Content style={{ paddingTop: title ? 0 : "40px" }}>
            {title && <h2 className="title">{title}</h2>}
            <UilTimes
              color="#fff"
              size={25}
              onClick={onClose}
              className="icon-close"
            />
            {children}
          </Content>
        </Portal>
      )}
    </CSSTransition>
  );
}

export default Modal;
