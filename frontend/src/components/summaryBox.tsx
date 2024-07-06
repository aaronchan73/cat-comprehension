import react, { useState, useEffect } from 'react';
import { Box, Typography, TextareaAutosize, Button } from '@mui/material';



export default function SummaryBox() {

    return (
        <div style={{height:'80%'}}>
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
                    width: '500px' ,
                    height:'500px'
                }}
            >
                <TextareaAutosize
                    aria-label="explanation"
                    minRows={4}
                    placeholder="Explain the code in the code box in plain English"
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        borderColor: 'grey',
                        resize: 'none',
                        height: '100%'
                    }}
                    // onChange={(e) => {e}}
                />
                <Button></Button>
            </Box>
        </div>
    );
}