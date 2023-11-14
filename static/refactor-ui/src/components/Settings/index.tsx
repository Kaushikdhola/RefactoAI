import {
  Autocomplete,
  Box,
  Breadcrumbs,
  CssBaseline,
  CssVarsProvider,
  FormHelperText,
  Grid,
  Link,
  Typography,
} from "@mui/joy";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

type Props = {};

const Settings = (props: Props) => {
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<string>(
    window.location.pathname?.split("/")?.[2]
  );
  const tabs = [
    {
      name: "Dashboard",
      key: "home",
      path: "/dashboard/home",
    },
    {
      name: "Configurations",
      key: "settings",
      path: "/dashboard/settings",
    },
  ];
  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: {
            sm: -100,
            md: -110,
          },
          bgcolor: "background.body",
          zIndex: 9995,
        }}
      >
        <Box
          sx={{
            px: {
              xs: 2,
              md: 6,
            },
          }}
        >
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
            sx={{ pl: 0 }}
          >
            <HomeRoundedIcon />
            <Typography color="neutral" fontSize={12} fontWeight={500}>
              Configurations
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: {
            xs: 2,
            md: 6,
          },
          py: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography
              level="h2"
              sx={{
                mt: 1,
                mb: 1,
              }}
            >
              Configurations
            </Typography>
            <Typography level="body-sm">
              Configure the behaviour of the bot.
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1} direction="row">
                <Stack direction="column" flex="1">
                  <FormLabel>Commit Interval</FormLabel>
                  <Input
                    size="md"
                    type="number"
                    defaultValue={2}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        max: 5,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>
                    No. of commits after which bot should trigger.
                  </FormHelperText>
                </Stack>
                <Stack direction="column" flex="1">
                  <FormLabel>Max Lines</FormLabel>
                  <Input
                    type="number"
                    size="md"
                    defaultValue={2}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        max: 5,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>Maximum Lines.</FormHelperText>
                </Stack>
              </Stack>
              <Stack direction="column" flex="1" spacing={1}>
                <FormLabel>Select Repository</FormLabel>
                <Autocomplete
                  size="md"
                  placeholder="Select Repo"
                  options={[
                    "Repo 1",
                    "Repo 2",
                    "Repo 3",
                    "Repo 4",
                    "Repo 5",
                    "Repo 6",
                  ]}
                  onSelect={(value) => console.log(value)}
                  startDecorator={<KeyboardDoubleArrowRightIcon />}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Source Branch</FormLabel>
                  <Autocomplete
                    size="md"
                    placeholder="Source Branch"
                    options={[
                      "Branch 2",
                      "Branch 1",
                      "Branch 3",
                      "Branch 4",
                      "Branch 5",
                      "Branch 6",
                    ]}
                    onSelect={(value) => console.log(value)}
                  />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Target Branch</FormLabel>
                  <Autocomplete
                    size="md"
                    placeholder="Target Branch"
                    options={[
                      "Branch 2",
                      "Branch 1",
                      "Branch 3",
                      "Branch 4",
                      "Branch 5",
                      "Branch 6",
                    ]}
                    startDecorator={
                      <KeyboardArrowRightIcon fontSize="medium" />
                    }
                    onSelect={(value) => console.log(value)}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1} direction="row">
                <Stack direction="column" flex="1">
                  <FormLabel>Commit Interval</FormLabel>
                  <Input
                    size="md"
                    type="number"
                    defaultValue={2}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        max: 5,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>
                    No. of commits after which bot should trigger.
                  </FormHelperText>
                </Stack>
                <Stack direction="column" flex="1">
                  <FormLabel>Max Lines</FormLabel>
                  <Input
                    type="number"
                    size="md"
                    defaultValue={2}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        max: 5,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>Maximum Lines.</FormHelperText>
                </Stack>
              </Stack>
              <Stack direction="column" flex="1" spacing={1}>
                <FormLabel>Select Repository</FormLabel>
                <Autocomplete
                  size="md"
                  placeholder="Select Repo"
                  options={[
                    "Repo 1",
                    "Repo 2",
                    "Repo 3",
                    "Repo 4",
                    "Repo 5",
                    "Repo 6",
                  ]}
                  onSelect={(value) => console.log(value)}
                  startDecorator={<KeyboardDoubleArrowRightIcon />}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Source Branch</FormLabel>
                  <Autocomplete
                    size="md"
                    placeholder="Source Branch"
                    options={[
                      "Branch 2",
                      "Branch 1",
                      "Branch 3",
                      "Branch 4",
                      "Branch 5",
                      "Branch 6",
                    ]}
                    onSelect={(value) => console.log(value)}
                  />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Target Branch</FormLabel>
                  <Autocomplete
                    size="md"
                    placeholder="Target Branch"
                    options={[
                      "Branch 2",
                      "Branch 1",
                      "Branch 3",
                      "Branch 4",
                      "Branch 5",
                      "Branch 6",
                    ]}
                    startDecorator={
                      <KeyboardArrowRightIcon fontSize="medium" />
                    }
                    onSelect={(value) => console.log(value)}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Discard
              </Button>
              <Button size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );

  // return (
  //   <CssVarsProvider disableTransitionOnChange>
  //     <CssBaseline />

  //     <Box
  //       sx={{
  //         flex: 1,
  //         width: "100%",
  //         alignContent: "center",
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           position: "sticky",
  //           top: {
  //             sm: -100,
  //             md: -110,
  //           },
  //           bgcolor: "background.body",
  //           zIndex: 9995,
  //         }}
  //       >
  //         <Box
  //           sx={{
  //             px: {
  //               xs: 2,
  //               md: 6,
  //             },
  //           }}
  //         >
  //           <Breadcrumbs
  //             size="sm"
  //             aria-label="breadcrumbs"
  //             separator={<ChevronRightRoundedIcon fontSize="small" />}
  //             sx={{ pl: 0 }}
  //           >
  //             <HomeRoundedIcon />
  //             <Typography color="neutral" fontSize={12} fontWeight={500}>
  //               Configurations
  //             </Typography>
  //           </Breadcrumbs>
  //         </Box>
  //       </Box>
  //       <Stack
  //         spacing={4}
  //         sx={{
  //           display: "flex",
  //           maxWidth: "800px",
  //           mx: "auto",
  //           px: {
  //             xs: 2,
  //             md: 6,
  //           },
  //           py: {
  //             xs: 2,
  //             md: 3,
  //           },
  //         }}
  //       >
  //         <Card>
  //           <Box sx={{ mb: 1 }}>
  //             <Typography
  //               level="h2"
  //               sx={{
  //                 mt: 1,
  //                 mb: 1,
  //               }}
  //             >
  //               Configurations
  //             </Typography>
  //             <Typography level="body-sm">
  //               Configure the behaviour of the bot.
  //             </Typography>
  //           </Box>
  //           <Divider />
  //           <Stack
  //             direction="row"
  //             spacing={3}
  //             sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
  //           >
  //             <Stack spacing={2} sx={{ flexGrow: 1 }}>
  //               <Stack spacing={1}>
  //                 <FormLabel>Name</FormLabel>
  //                 <FormControl
  //                   sx={{
  //                     display: {
  //                       sm: "flex-column",
  //                       md: "flex-row",
  //                     },
  //                     gap: 2,
  //                   }}
  //                 >
  //                   <Stack direction="row" spacing={1}>
  //                     <Input size="sm" placeholder="First name" />
  //                     <Input
  //                       size="sm"
  //                       placeholder="Last name"
  //                       sx={{ flexGrow: 1 }}
  //                     />
  //                   </Stack>
  //                 </FormControl>
  //               </Stack>
  //               <Stack direction="row" spacing={2}>
  //                 <FormControl>
  //                   <FormLabel>Role</FormLabel>
  //                   <Input size="sm" defaultValue="UI Developer" />
  //                 </FormControl>
  //                 <FormControl sx={{ flexGrow: 1 }}>
  //                   <FormLabel>Email</FormLabel>
  //                   <Input
  //                     size="sm"
  //                     type="email"
  //                     startDecorator={<EmailRoundedIcon />}
  //                     placeholder="email"
  //                     defaultValue="siriwatk@test.com"
  //                     sx={{ flexGrow: 1 }}
  //                   />
  //                 </FormControl>
  //               </Stack>
  //               <div>{/* <CountrySelector /> */}</div>
  //               <div>
  //                 <FormControl sx={{ display: { sm: "contents" } }}>
  //                   <FormLabel>Timezone</FormLabel>
  //                   <Select
  //                     size="sm"
  //                     startDecorator={<AccessTimeFilledRoundedIcon />}
  //                     defaultValue="1"
  //                   >
  //                     <Option value="1">
  //                       Indochina Time (Bangkok){" "}
  //                       <Typography textColor="text.tertiary" ml={0.5}>
  //                         — GMT+07:00
  //                       </Typography>
  //                     </Option>
  //                     <Option value="2">
  //                       Indochina Time (Ho Chi Minh City){" "}
  //                       <Typography textColor="text.tertiary" ml={0.5}>
  //                         — GMT+07:00
  //                       </Typography>
  //                     </Option>
  //                   </Select>
  //                 </FormControl>
  //               </div>
  //             </Stack>
  //           </Stack>
  //           <Stack
  //             direction="column"
  //             spacing={2}
  //             sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
  //           >
  //             <Stack direction="row" spacing={2}>
  //               <Stack spacing={1} sx={{ flexGrow: 1 }}>
  //                 <FormLabel>Name</FormLabel>
  //                 <FormControl
  //                   sx={{
  //                     display: {
  //                       sm: "flex-column",
  //                       md: "flex-row",
  //                     },
  //                     gap: 2,
  //                   }}
  //                 >
  //                   <Stack direction="row" spacing={1}>
  //                     <Input size="sm" placeholder="First name" />
  //                     <Input
  //                       size="sm"
  //                       placeholder="Last name"
  //                       sx={{ flexGrow: 1 }}
  //                     />
  //                   </Stack>
  //                 </FormControl>
  //               </Stack>
  //             </Stack>
  //             <FormControl>
  //               <FormLabel>Role</FormLabel>
  //               <Input size="sm" defaultValue="UI Developer" />
  //             </FormControl>
  //             <FormControl sx={{ flexGrow: 1 }}>
  //               <FormLabel>Email</FormLabel>
  //               <Input
  //                 size="sm"
  //                 type="email"
  //                 startDecorator={<EmailRoundedIcon />}
  //                 placeholder="email"
  //                 defaultValue="siriwatk@test.com"
  //                 sx={{ flexGrow: 1 }}
  //               />
  //             </FormControl>
  //             <div>{/* <CountrySelector /> */}</div>
  //             <div>
  //               <FormControl sx={{ display: { sm: "contents" } }}>
  //                 <FormLabel>Timezone</FormLabel>
  //                 <Select
  //                   size="sm"
  //                   startDecorator={<AccessTimeFilledRoundedIcon />}
  //                   defaultValue="1"
  //                 >
  //                   <Option value="1">
  //                     Indochina Time (Bangkok){" "}
  //                     <Typography textColor="text.tertiary" ml={0.5}>
  //                       — GMT+07:00
  //                     </Typography>
  //                   </Option>
  //                   <Option value="2">
  //                     Indochina Time (Ho Chi Minh City){" "}
  //                     <Typography textColor="text.tertiary" ml={0.5}>
  //                       — GMT+07:00
  //                     </Typography>
  //                   </Option>
  //                 </Select>
  //               </FormControl>
  //             </div>
  //           </Stack>
  //           <CardOverflow
  //             sx={{ borderTop: "1px solid", borderColor: "divider" }}
  //           >
  //             <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
  //               <Button size="sm" variant="outlined" color="neutral">
  //                 Cancel
  //               </Button>
  //               <Button size="sm" variant="solid">
  //                 Save
  //               </Button>
  //             </CardActions>
  //           </CardOverflow>
  //         </Card>
  //       </Stack>
  //     </Box>
  //     {/* </Box> */}
  //     {/* </Box> */}
  //   </CssVarsProvider>
  // );
};

export default Settings;
