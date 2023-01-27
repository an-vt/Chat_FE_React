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

const IconClose = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;

function Modal({ title = "", visible, onClose, children }: Props) {
  const Content = styled.div`
    padding: 0 20px 20px 20px;
    min-width: 350px;
    max-width: 450px;

    .title {
      text-align: center;
    }
  `;

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
