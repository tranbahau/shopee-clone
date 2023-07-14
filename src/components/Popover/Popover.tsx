import { FloatingPortal, arrow, offset, shift, useFloating, type Placement } from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ElementType, ReactNode, useId, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  renderPopover: ReactNode;
  as?: ElementType;
  initialOpen?: boolean;
  placement?: Placement;
}

export default function Popover({
  children,
  className,
  renderPopover,
  as: Element = 'div',
  initialOpen,
  placement = 'bottom-end'
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false);
  const arrowRef = useRef<HTMLElement>(null);
  const id = useId();
  const { refs, strategy, x, y, middlewareData } = useFloating({
    open: isOpen,
    placement: placement,
    onOpenChange: setIsOpen,
    middleware: [shift(), offset(5), arrow({ element: arrowRef })]
  });

  const showPopOver = () => {
    setIsOpen(true);
  };

  const hidePopOver = () => {
    setIsOpen(false);
  };

  return (
    <Element ref={refs.setReference} className={className} onMouseLeave={hidePopOver} onMouseEnter={showPopOver}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className='tooltip'
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content'
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
              ref={refs.setFloating}
            >
              <span
                className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-b-white border-t-transparent'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
                ref={arrowRef}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  );
}
