function Switch({isChecked, handleOnChange}) {
  return (
    <label className="switch">
        <input type="checkbox" checked={isChecked} onChange={handleOnChange} />
        <span className="slider round"></span>
    </label>
  )
}
export default Switch