export function useGotoRouter() {

  const handleGotoLoginLocation = () => {
    location.replace("/login");
  };

  return {
    handleGotoLoginLocation,

  };
}
