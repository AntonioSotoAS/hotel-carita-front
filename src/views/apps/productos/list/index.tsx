'use client'

// Component Imports
import UserListCards from './UserListCards'
import ProductListTable from './ProductListTable'

// MUI Imports
import Grid from '@mui/material/Grid'

const ProductosPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListCards />
      </Grid>
      <Grid item xs={12}>
        <ProductListTable />
      </Grid>
    </Grid>
  )
}

export default ProductosPage
