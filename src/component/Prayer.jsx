import { Card, CardContent, CardMedia, Typography } from '@mui/material'
// import React from 'react'

export default function Prayer({name, time, image}) {
  return (
    <Card sx={{ width:{ xs: 350 ,sm: 260} , margin: 2 }}>
      
    <CardMedia
      sx={{ height: 140 }}
      image={image}
      title="green iguana"
    />
    <CardContent>
      <h2>
        {name}
      </h2>
      <Typography variant="h2" color="text.secondary">
        {time}
      </Typography>
    </CardContent>
  </Card>
  )
}
