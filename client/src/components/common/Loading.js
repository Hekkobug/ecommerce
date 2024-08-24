import React, { memo } from 'react'
import { HashLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div>
      <HashLoader color='#9321ea'/>
    </div>
  )
}

export default memo(Loading)
