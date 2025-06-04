export default function Point({ x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 10,
        height: 10,
        background: 'red',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}