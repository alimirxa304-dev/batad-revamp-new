import * as Dialog from "@radix-ui/react-dialog";
import styles from "@/sass/components/common/application-modal.module.scss"

const ApplicationModal = ({
  open,
  onOpenChange,
  triggerLabel,
  children,
  contentClassName,
}) => {
  const isControlled = open !== undefined;
  const contentClasses = [styles.modal, contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {!isControlled && (
        <Dialog.Trigger asChild>
          <button className={styles.triggerBtn}>{triggerLabel}</button>
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={contentClasses} aria-describedby={undefined}>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};


export default ApplicationModal;
