import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Select, MenuItem,
  IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NavBar({ user, onLogout }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { to: '/', label: t('Dashboard') },
    { to: '/inventory', label: t('Inventory') },
    { to: '/pos', label: t('POS') },
    { to: '/suppliers', label: t('Suppliers') },
    { to: '/reports', label: t('Reports') },
  ];
  if (user?.role === 'admin') {
    links.push({ to: '/settings', label: t('Settings') });
  }

  const lang = i18n.language;
  const handleLangChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Warehouse Manager
          </Typography>

          {!isMobile && (
            <Box>
              {links.map(link => (
                <Button
                  key={link.to}
                  color="inherit"
                  component={Link}
                  to={link.to}
                  sx={{ textTransform: 'none' }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Select
              value={lang}
              onChange={handleLangChange}
              size="small"
              sx={{
                mr: 2, color: 'white',
                borderColor: 'white',
                '.MuiOutlinedInput-notchedOutline': { border: 0 }
              }}
            >
              <MenuItem value="en">{t('English')}</MenuItem>
              <MenuItem value="es">{t('Spanish')}</MenuItem>
            </Select>
            {!isMobile && (
              <>
                <Typography variant="body1" sx={{ display: 'inline', mr: 1 }}>{user?.username}</Typography>
                <Button color="inherit" onClick={onLogout}>{t('Logout')}</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          {links.map(link => (
            <ListItem
              button
              key={link.to}
              component={Link}
              to={link.to}
              onClick={toggleDrawer}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
          <ListItem>
            <Typography variant="body2" sx={{ mr: 1 }}>{user?.username}</Typography>
            <Button color="primary" onClick={onLogout}>{t('Logout')}</Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default NavBar;
