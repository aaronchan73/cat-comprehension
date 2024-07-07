import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { IAnalysis } from '../../types/IAnalysis'

export default function ResultsPage() {
    const [analysis, setAnalysis] = useState<IAnalysis>()
    
    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '10px', // Rounded corners
                    backgroundColor: '#f0f0f0', // Light grey background
                    marginTop: '20px',
                    width: '500px',
                    height: '500px'
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '10px', // Rounded corners
                    backgroundColor: '#f0f0f0', // Light grey background
                    marginTop: '20px',
                    width: '500px',
                    height: '500px'
                }}
            />
        </div>

    )
}