import React from "react";
import { Box, Container, Divider, Link, Typography } from "@mui/joy";
export const Documentation = () => {
  return (
    <Container
      sx={(theme) => ({
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        pt: 2,
        pb: 10,
        gap: 4,
        [theme.breakpoints.up(834)]: {
          flexDirection: "row",
          gap: 6,
        },
        [theme.breakpoints.up(1199)]: {
          gap: 12,
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "left",
          gap: 1,
          textAlign: "initial",
        })}
      >
        <Typography level="h2">User Scenarios</Typography>
        <Divider orientation="horizontal" />
        <Typography level="h3">Features</Typography>
        <Divider orientation="horizontal" />
        <Box gap={1}>
          <Typography startDecorator={"•"}>
            Easy to install on the Github Repository.
          </Typography>
          <Typography startDecorator={"•"}>
            Configure the settings on Re-facto webiste.
          </Typography>
          <Typography startDecorator={"•"}>
            Raises the pull request with the refactored code.
          </Typography>
          <Typography startDecorator={"•"}>
            Dashboard to see the insights of the pull requests generated by the
            Re-facto bot.
          </Typography>
        </Box>
        <Typography level="h3">Scenarios</Typography>
        <Typography level="title-lg">
          <Typography fontFamily={"monospace"}>1.</Typography>
          Installing the GitHub app to their repository
        </Typography>
        <Typography level="body-md">
          User can easily install the{" "}
          <Typography level="title-md">
            <Link href="https://github.com/marketplace/re-facto">
              Re-Facto app
            </Link>{" "}
          </Typography>
          from the Github Marketplace. On install, they will be prompted to
          authorize the app to have a read and write access of the all
          repositories or only the selected repositories. The read premissions
          is required to read the last committed files and write premissions is
          used to refactor the files and generate pull request with refactored
          code.
        </Typography>
        <Typography level="title-lg">
          <Typography fontFamily={"monospace"}>2.</Typography>
          Logging into Re-facto Website
        </Typography>
        <Typography level="body-md">
          After installation from marketplace, the user will be redirected to
          the Re-Facto website or can login using their GitHub credentials,
          ensuring a secure and seamless authentication process. Upon successful
          authentication, they are directed to the dashboard where they can see
          insights of the refactored code and pull request information generated
          by the bot for every repository configured by the user.
        </Typography>
        <Typography level="title-lg">
          <Typography fontFamily={"monospace"}>3.</Typography>
          Configuring settings for the Re-facto bot
        </Typography>
        <Typography level="body-md">
          When a user navigates to the configuration setting tab on the Re-Facto
          Dashboard. They will be able to configure following settings:
          <br />
          <Box gap={1}>
            <Typography startDecorator={"◦"}>
              <Typography level="title-md">Commit Intervals:</Typography>
              Ensure the controlled bot activation based on the defined commit
              intervals by the user.
            </Typography>
            <Typography startDecorator={"◦"}>
              <Typography level="title-md">Minimum Lines:</Typography>
              Setting a minimum lines threshold ensures the bot activates only
              when commits has minimum lines of modified code.
            </Typography>
            <Typography startDecorator={"◦"}>
              <Typography level="title-md">Select Repository:</Typography>{" "}
              Specify the repository on which bot should run with defined
              configurations.
            </Typography>
            <Typography startDecorator={"◦"}>
              <Typography level="title-md">Select Branch to Track:</Typography>{" "}
              Extra level of specification in the specified repository to ensure
              the activation of bot when the code changes triggered in the
              defined branch.
            </Typography>
            <Typography startDecorator={"◦"}>
              <Typography level="title-md">
                Select your Target Branch:
              </Typography>{" "}
              Generates a pull request to merge the refactored code to the user
              defined target branch.
            </Typography>
          </Box>
        </Typography>
        <Typography level="body-md">
          Once the configuration settings have been changed, the user needs to
          press{" "}
          <Typography variant="soft" color="primary">
            save
          </Typography>{" "}
          button to have the settings in effect.
        </Typography>
        <Typography level="title-lg">
          <Typography fontFamily={"monospace"}>4.</Typography>
          Approving the pull request on GitHub
        </Typography>
        <Typography level="body-md">
          When a Re-Facto bot raises a pull request, the user can manually
          reviews the refactored code in order to ensure quality of code. If
          user satisfies with the code quality then PR can be approved. However,
          the repository owner has the ability to reject a pull request if it
          breaks code quality rules.
        </Typography>
      </Box>
    </Container>
  );
};
