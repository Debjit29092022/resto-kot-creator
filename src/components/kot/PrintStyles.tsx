
export const PrintStyles = () => {
  return (
    <style>{`
      @media print {
        body * {
          visibility: hidden;
        }
        #printRef, #printRef * {
          visibility: visible;
        }
        #printRef {
          position: absolute;
          left: 0;
          top: 0;
          width: 80mm; /* Standard thermal printer width */
          padding: 0;
        }
      }
    `}</style>
  );
};
