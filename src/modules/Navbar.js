const styles = {
  container: { display: "flex", justifyContent: "space-between" },
  navItem: { flex: 1 },
};

const ConnectButton = ()=>{
    return <div></div>
}

const Navbar = ({ account, network }) => {
  return (
    <div style={styles.container}>
      <div style={styles.navItem}>Awesome App</div>
      <div style={styles.navItem}>{account}</div>
      <div style={styles.navItem}>{network}</div>
    </div>
  );
};

export default {Navbar};
