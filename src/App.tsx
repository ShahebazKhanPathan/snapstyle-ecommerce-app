// Load required components
import { Grid, GridItem, Box, Button, Image, Show, Hide, Menu, MenuButton, MenuList, MenuItem, IconButton, Stack, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton, List, ListItem, Icon } from "@chakra-ui/react"
import SearchBar from "./components/SearchBar"
import CategoryList from "./components/CategoryList"
import { FaChevronDown, FaUserCircle, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { ImUserPlus  } from "react-icons/im";
import { GiWashingMachine, GiSofa } from "react-icons/gi";
import { FaTshirt, FaLaptop } from "react-icons/fa";
import { MdToys } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoCube, IoMenu } from "react-icons/io5";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

// Load services
import apiClient from "./services/api-client";
import commonStyles from "./utils/commonCSS";

type ContextType = { setCount: (count: number) => void };

export function useCart() {
  return useOutletContext<ContextType>();
}

const token = localStorage.getItem('auth-token');

function App() {
  
  const [drawer, setDrawer] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const logOut = async () => {
    await apiClient.delete("/api/blacklist",
      { headers: { "auth-token": localStorage.getItem('auth-token') } })
      .then(() => {
        localStorage.removeItem("auth-token");
        window.location.href="/";
      })
      .catch((err) => console.log(err));
  }

  const checkTokenExpiry = async () => {
    if (token) {
      await apiClient.get("/api/blacklist", { headers: { "auth-token": localStorage.getItem('auth-token') } })
        .then(({ data }) => {
          console.log(data);
          setCartCount(data.cartItemsCount);
        })
      .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    checkTokenExpiry();
  },[]);

  return (
    <>
      <Grid
        paddingX={{ base: 2, sm: 4}}
        paddingY={{ base: 3, sm: 1, md: 3, lg: 3, xl: 3}}
        templateAreas={{
          base: `"logo nav" "aside main"`,
        }}
        templateColumns={{
          base: 'repeat(6, 1fr)',
          sm: 'repeat(6, 1fr)',
          md: 'repeat(6, 1fr)',
          lg: 'repeat(6, 1fr)',
          xl: 'repeat(6, 1fr)'
        }}
        gap={{ base: 2, sm: 2, md: 4}}
        alignItems="center">
        
        <GridItem colSpan={{ base: 3, sm: 3, md: 1 }}>
          <Box width={{ base: "170px", sm: "180px", md: "180px", lg: "220px", xl: "220px" }}>
            <Stack direction="row">
              <Show below="md">
                <IconButton onClick={() => setDrawer(true)} variant="ghost" colorScheme="green" aria-label="menu" size="sm" icon={<IoMenu />} />
                <Drawer placement="left" isOpen={drawer} onClose={() => setDrawer(false)} size="xs">
                  <DrawerOverlay>
                    <DrawerContent>
                      <DrawerCloseButton/>
                      <DrawerHeader color="green">Categories</DrawerHeader>
                      <DrawerBody>
                        <List spacing={2} padding={0}>
                          <ListItem>
                              <Link to={"/"} onClick={() => setDrawer(false)}>
                                  <Button fontWeight={commonStyles.app.fontWeight} size={commonStyles.app.menuLinkSizes} variant="ghost" leftIcon={<IoCube />}>All Products</Button>
                              </Link>
                          </ListItem>
                          <ListItem>
                              <Link to={"/category?name=Fashion"} onClick={() => setDrawer(false)}>
                                  <Button fontWeight={commonStyles.app.fontWeight} size={commonStyles.app.menuLinkSizes} variant="ghost" leftIcon={<FaTshirt />}>Fashion</Button>
                              </Link>
                          </ListItem>
                          <ListItem>
                              <Link to={"/category?name=Electronics"} onClick={() => setDrawer(false)}>
                              <Button fontWeight={commonStyles.app.fontWeight} size={commonStyles.app.menuLinkSizes} variant="ghost" leftIcon={<FaLaptop />}>Electronics</Button>
                              </Link>
                          </ListItem>
                          <ListItem>
                              <Link to={"/category?name=Appliances"} onClick={() => setDrawer(false)}>
                                  <Button fontWeight={commonStyles.app.fontWeight} size={commonStyles.app.menuLinkSizes} variant="ghost" leftIcon={<GiWashingMachine />}>Appliances</Button>
                              </Link>
                          </ListItem>
                          <ListItem>
                              <Link to={"/category?name=Furniture"} onClick={() => setDrawer(false)}>
                                  <Button fontWeight={commonStyles.app.fontWeight} size={commonStyles.app.menuLinkSizes} variant="ghost" leftIcon={<GiSofa />}>Furniture</Button>
                              </Link>
                          </ListItem>
                          <ListItem>
                              <Link to={"/category?name=Toys"} onClick={() => setDrawer(false)}>
                                  <Button fontWeight={commonStyles.app.fontWeight} size={commonStyles.app.menuLinkSizes} variant="ghost" leftIcon={<MdToys />}>Toys</Button>
                              </Link>
                          </ListItem>
                        </List>
                      </DrawerBody>
                    </DrawerContent>
                  </DrawerOverlay>
                </Drawer>
              </Show>
              <Link to={"/"}>
                <Image src="/logo.png"/>
              </Link>
            </Stack>
          </Box>
        </GridItem>

        <Hide below="md">
          <GridItem colSpan={{base: 4, sm: 4, md: 3, lg: 3, xl: 3}}>
            <SearchBar/>
          </GridItem>
        </Hide>

        <GridItem colSpan={{base: 3, sm: 3, md: 2, lg: 2, xl: 2}}>
          {token
            ?
            <Box textAlign={{base: "right", xl: "center"}} mr={{base: "10px"}}>
              <Link to={"/cart"}>
                <span className="badge rounded-pill text-bg-danger">{cartCount>0 ? cartCount : ''}</span>
                <Icon as={FaShoppingCart} ml={1} fontSize={commonStyles.app.iconSizes} color={"green"}/>
              </Link>
              <Menu>
                <MenuButton fontSize={commonStyles.app.buttonSizes} ml={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5}}  variant="ghost" colorScheme="green" as={Button} rightIcon={<FaChevronDown />}>
                  <Icon as={FaUserCircle} color={"green"}/> Account
                </MenuButton>
                <MenuList>
                  <MenuItem fontSize={commonStyles.app.buttonSizes}>
                    <Link to={"/orders"}>
                      <Icon as={IoCube} color="green" /> My Orders
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={() => logOut()} fontSize={commonStyles.app.buttonSizes}>
                    <Icon as={FaSignOutAlt} color="green" mr={1} /> Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
            :
            <Box textAlign={{base: "right", lg: "left", xl: "center"}} mr={{md: "10px"}}>
              <Menu>
                <MenuButton padding={0} size={commonStyles.app.buttonSizes} variant="ghost" colorScheme="green" as={Button} leftIcon={<FaUserCircle />} rightIcon={<FaChevronDown/>}>
                  Login
                </MenuButton>
                <MenuList>
                  <MenuItem alignItems="center" fontSize={commonStyles.app.buttonSizes}> 
                    <Link to={"/signin"}><Icon color="green" as={FaUserCircle} /> User</Link>
                  </MenuItem>
                  <MenuItem alignItems="center" fontSize={commonStyles.app.buttonSizes}>
                    <Link to={"/admin"}><Icon color="green" as={MdAdminPanelSettings} /> Admin</Link>
                  </MenuItem>
                </MenuList>
              </Menu>
              <Link to={"/signup"}><Button colorScheme="green" variant="ghost" size={commonStyles.app.buttonSizes} leftIcon={<ImUserPlus  />}>Sign Up</Button></Link>
            </Box>
          }
        </GridItem>

        <Show below="md">
          <GridItem colSpan={{ base: 6, sm: 6}}>
            <SearchBar/>
          </GridItem>
        </Show>
      </Grid>

      <Grid
        templateColumns={{
          md: 'repeat(6, 1fr)',
          lg: 'repeat(6, 1fr)'
        }}
        templateRows="repeat(1, 1fr)"
        paddingX={{ base: 2, sm: 4, md: 4, lg: 4, xl: 4}}
        paddingTop={{ base: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
        paddingBottom={{ base: 3, sm: 1, md: 3, lg: 5}}
        gap={4} >
        
        <Show above='md'>
          <GridItem width={{ md: "160px", lg: "220px" }}>
            <CategoryList/>
          </GridItem>
        </Show>

        <GridItem colSpan={{ base: 5, sm: 5, md: 5, lg: 4, xl: 4 }}>
          <Outlet context={ { setCount(count) {
            setCartCount(cartCount + count);
          },} satisfies ContextType } />
        </GridItem>
      </Grid>
    </>
  )
}

export default App
