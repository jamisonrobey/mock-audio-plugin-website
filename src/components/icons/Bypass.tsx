interface BypassIconProps {
  toggle: boolean;
  handleToggle: () => void;
}

export const BypassIcon: React.FC<BypassIconProps> = ({ toggle, handleToggle: onToggle }) => {
  return (
    <svg
      className='h-32 w-32 fill-none stroke-acccent'
      version='1.1'
      id='Layer_1'
      onClick={onToggle}
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      viewBox='0 0 960 560'
      xmlSpace='preserv'
    >
      <polygon strokeWidth={15} points='398.4,423.5 316.8,282 398.4,140.5 561.6,140.5 643.2,282 561.6,423.5 ' />
      <circle strokeWidth={10} fill={toggle ? '#c9c9c9' : 'none'} cx='479.5' cy='281.5' r='100' />
    </svg>
  );
};
