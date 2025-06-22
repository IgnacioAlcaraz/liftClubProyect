import React from "react";
import { Modal } from "react-bootstrap";
import "./BaseModal.css";

const BaseModal = ({
  show,
  onClose,
  title,
  children,
  footer,
  size = "md",
  centered = true,
  staticBackdrop = false,
}) => {
  return (
    <div className="modal-wrapper">
      <Modal
        show={show}
        onHide={onClose}
        centered={centered}
        size={size}
        backdrop={staticBackdrop ? "static" : true}
        className="custom-modal"
      >
        <div className="modal-card">
          <Modal.Header closeButton>
            <Modal.Title as="h2">{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>{children}</Modal.Body>

          {footer && (
            <Modal.Footer className="modal-footer d-flex justify-content-end">
              {footer}
            </Modal.Footer>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BaseModal;
