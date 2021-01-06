import React from 'react'
import { connect } from 'react-redux'

import { Sidebar } from '../Sidebar'
import { setEditorCtx, setAlphaPattern } from '../../redux/actions'
import { selectSourceImage, selectSourceProps } from '../../redux/selectors'
import { CANVAS_WH } from '../../constants'
import { canvasRender, createAlphaPattern } from '../../utils'

import './App.scss'

const App = ({ image, imageProps, setEditorCtx, setAlphaPattern }) => {
	const canvasRef = React.useRef()

	React.useEffect(() => {
		const ctx = canvasRef.current.getContext('2d')
		setEditorCtx(ctx)

		createAlphaPattern(ctx)
		.then((result) => {
			setAlphaPattern(result)
			canvasRender(ctx, result, image, imageProps)
		})
	}, [])

	return (
		<div className="app">
			<Sidebar />
			<main>
				<div className="has-text-centered">
					<canvas 
						ref={canvasRef}
						width={CANVAS_WH} 
						height={CANVAS_WH}
					/>
				</div>
			</main>
		</div>

	)
}

const mapStateToProps = (state) => { 
  return { 
    image: selectSourceImage(state),
    imageProps: selectSourceProps(state)
  }
}

export default connect(mapStateToProps, { setEditorCtx, setAlphaPattern })(App)