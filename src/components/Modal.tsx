import { UilTimes } from "@iconscout/react-unicons";
import { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import Portal from "./Portal";

interface Props {
  visible: boolean;
  onClose: any;
  children: ReactNode;
}

const IconClose = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 40px;
  min-width: 350px;
  max-width: 450px;
`;

function Modal({ visible, onClose, children }: Props) {
  return (
    <CSSTransition in={visible} timeout={250} classNames="zoom" unmountOnExit>
      {(status) => (
        <Portal
          visible={status !== "exited"}
          onClose={onClose}
          bodyStyle={{ transition: "all 250ms" }}
        >
          <Content>
            <IconClose onClick={onClose}>
              <UilTimes size={25} />
            </IconClose>
            {children}
          </Content>
        </Portal>
      )}
    </CSSTransition>
  );
}

export default Modal;
