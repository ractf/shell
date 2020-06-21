// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React from "react";

import {
    Page, HR, Row, Button, Input, TextBlock, ProgressBar, Radio, Scrollbar,
    Select, Spinner, TabbedView, Tab, Table, ToggleButton, FlashText, Tree,
    TreeWrap, TreeValue, Checkbox, InputButton, Leader, FormGroup, Card,
    H1, H2, H3, H4, H5, H6, SubtleText, Badge, InputGroup, InputHint, NavBar,
    NavBrand, NavGap, NavLink, NavMenu, NavMenuLink, NavItem, NavCollapse,
    Footer, FootRow, FootCol, FootLink, Column, Breadcrumbs, Crumb, Form,
    BareForm
} from "@ractf/ui-kit";
import { TYPES } from "@ractf/util";
import { zxcvbn } from "ractf";


const Inner = () => (<NavCollapse>
    <NavLink to={"#"}>Home</NavLink>
    <NavLink to={"#"}>About</NavLink>
    <NavLink to={"#"}>Get Started</NavLink>
    <NavLink to={"#"}>API Reference</NavLink>

    <NavGap />

    <NavMenu name={"More"}>
        <NavMenuLink to={"#"}>Test</NavMenuLink>
        <NavMenuLink to={"#"}>Test</NavMenuLink>
        <NavMenuLink to={"#"}>Test</NavMenuLink>

        <NavMenu name={"More"}>
            <NavMenuLink to={"#"}>Test</NavMenuLink>
            <NavMenuLink to={"#"}>Test</NavMenuLink>
            <NavMenu name={"More"}>
                <NavMenuLink to={"#"}>Test</NavMenuLink>

                <NavMenu name={"More"}>
                    <NavMenuLink to={"#"}>Test</NavMenuLink>
                    <NavMenuLink to={"#"}>Test</NavMenuLink>
                    <NavMenuLink to={"#"}>Test</NavMenuLink>
                </NavMenu>

                <NavMenuLink to={"#"}>Test</NavMenuLink>
                <NavMenuLink to={"#"}>Test</NavMenuLink>
            </NavMenu>

            <NavMenuLink to={"#"}>Test</NavMenuLink>
        </NavMenu>
    </NavMenu>
</NavCollapse>);

export default () => <Page><Row left>
    <H1>Really Awesome UI Framework</H1>
    <HR />
    <H2>Nav Bars</H2>
    <NavBar>
        <NavBrand>RACTF/<b>UI-KIT</b></NavBrand>
        <NavCollapse>
            <NavLink to={"#"}>Home</NavLink>
            <NavLink to={"#"}>About</NavLink>
            <NavLink to={"#"}>Get Started</NavLink>
            <NavLink to={"#"}>API Reference</NavLink>

            <NavGap />
            <NavItem>This is some text</NavItem>
            <NavGap />
            <BareForm>
                <Input placeholder={"Search"} />
            </BareForm>
        </NavCollapse>
    </NavBar>
    <NavBar primary>
        <NavBrand>Primary</NavBrand>
        <Inner />
    </NavBar>
    <NavBar secondary>
        <NavBrand>Secondary</NavBrand>
        <Inner />
    </NavBar>
    <NavBar success>
        <NavBrand>Success</NavBrand>
        <Inner />
    </NavBar>
    <NavBar info>
        <NavBrand>Info</NavBrand>
        <Inner />
    </NavBar>
    <NavBar warning>
        <NavBrand>Warning</NavBrand>
        <Inner />
    </NavBar>
    <NavBar danger>
        <NavBrand>Danger</NavBrand>
        <Inner />
    </NavBar>
    <HR />
    <Breadcrumbs>
        <Crumb to={"#"}>You</Crumb>
        <Crumb to={"#"}>Are</Crumb>
        <Crumb>Here!</Crumb>
    </Breadcrumbs>
    <HR />
    <H1>Heading 1</H1>
    <H2>Heading 2</H2>
    <H3>Heading 3</H3>
    <H4>Heading 4</H4>
    <H5>Heading 5</H5>
    <H6>Heading 6</H6>
    <HR />
    <H2>Badges</H2>
    <Column lgWidth={6} mdWidth={12}>
        <Row left tight>
            {TYPES.map(type => (
                <Badge {...{ [type]: true }} key={type}>{type}</Badge>
            ))}
        </Row>
    </Column>
    <Column lgWidth={6} mdWidth={12}>
        <Row left tight>
            {TYPES.map(type => (
                <Badge pill {...{ [type]: true }} key={type}>{type}</Badge>
            ))}
        </Row>
    </Column>
    <HR />
    <H2>Buttons</H2>
    <Column lgWidth={6} mdWidth={12}>
        <Row left>
            {TYPES.map(type => (
                <Button {...{ [type]: true }} key={type}>{type}</Button>
            ))}
        </Row>
        <Row left>
            {TYPES.map(type => (
                <Button disabled {...{ [type]: true }} key={type}>{type}</Button>
            ))}
        </Row>
        <Row left>
            {TYPES.map(type => (
                <Button lesser {...{ [type]: true }} key={type}>{type}</Button>
            ))}
        </Row>
        <Row left>
            <Button large>Large</Button>
        </Row>
        <ToggleButton
            options={[["Option 1", 1], ["Option 2", 2], ["Option 3", 3], ["Option 4", 4], ["Option 5", 5]]}
            default={2} />
        <ToggleButton small
            options={[["<", 0], ["1", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], [">", 6]]}
            default={2} />
    </Column>
    <Column lgWidth={6} mdWidth={12}>
        <Row left>
            {TYPES.map(type => (
                <Button pill {...{ [type]: true }} key={type}>{type}</Button>
            ))}
        </Row>
        <Row left>
            {TYPES.map(type => (
                <Button pill disabled {...{ [type]: true }} key={type}>{type}</Button>
            ))}
        </Row>
        <Row left>
            {TYPES.map(type => (
                <Button pill lesser {...{ [type]: true }} key={type}>{type}</Button>
            ))}
        </Row>
        <Row left>
            <Button pill large>Large</Button>
        </Row>
        <ToggleButton pill
            options={[["Option 1", 1], ["Option 2", 2], ["Option 3", 3], ["Option 4", 4], ["Option 5", 5]]}
            default={2} />
        <ToggleButton pill small
            options={[["<", 0], ["1", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], [">", 6]]}
            default={2} />
    </Column>
    <HR />
    <H2>Inputs</H2>
    <Column lgWidth={6}>
        <Form>
            <FormGroup label={"Basic Inputs"}>
                <Input name="def" placeholder={"Default"} />
                <Input name="inv" placeholder={"Invalid"} error />
                <Input name="lim" placeholder={"Limited"} limit={15} />
                <Input name="mul" placeholder={"Multi-line"} rows={3} />
                <Input name="pas" placeholder={"Password"} password />
                <Input name="pst" zxcvbn={zxcvbn()} placeholder={"Password with strength"} password />
            </FormGroup>
            <FormGroup label={"Select"}>
                <Select options={[
                    { key: 0, value: "Example Select" },
                    { key: 1, value: "This" },
                    { key: 2, value: "is" },
                    { key: 3, value: "a" },
                    { key: 4, value: "dropdown" },
                ]} />
            </FormGroup>
        </Form>
    </Column>
    <Column lgWidth={6}>
        <Form locked>
            <FormGroup label={"Disabled"}>
                <Input name="dis" placeholder={"Disabled"} />
            </FormGroup>
        </Form>
        <Form>
            <FormGroup label={"Input Groups"}>
                <InputButton name="inl" placeholder={"Inline Submit"} />
                <InputGroup name="ing" left={
                    <InputHint>@</InputHint>
                } right={<>
                    <Button success>Add New</Button>
                    <Button danger>Remove</Button>
                </>} />
            </FormGroup>
        </Form>
        <Form locked>
            <FormGroup label={"Disabled Input Groups"}>
                <InputButton name="din" placeholder={"Disabled Inline Submit"} />
                <InputGroup name="dig" left={
                    <InputHint>@</InputHint>
                } right={<>
                    <Button success>Add New</Button>
                    <Button danger>Remove</Button>
                </>} />
            </FormGroup>
        </Form>
    </Column>
    <HR />
    <H2>Progress Bar</H2>
    <Row>
        <Column lgWidth={6}>
            <Row>
                <ProgressBar />
                <ProgressBar progress={.25} />
                <ProgressBar progress={.50} />
                <ProgressBar progress={.75} />
                <ProgressBar progress={1} />
            </Row>
        </Column>
        <Column lgWidth={6}>
            <Row>
                <ProgressBar thick />
                <ProgressBar thick progress={.25} />
                <ProgressBar thick progress={.50} />
                <ProgressBar thick progress={.75} />
                <ProgressBar thick progress={1} />
            </Row>
        </Column>
    </Row>
    <HR />
    <Column lgWidth={6}>
        <H2>Radio</H2>
        <Form>
            <Radio name="demoRadio" options={
                [["Option 1", 1], ["Option 2", 2], ["Option 3", 3]]
            } val={2} />
        </Form>
        <HR />
    </Column>
    <Column lgWidth={6}>
        <H2>Checkbox</H2>
        <Form>
            <Checkbox name="cb1">Checkbox</Checkbox>
            <Checkbox name="cb2" val={true}>Checkbox checked</Checkbox>
        </Form>
        <HR />
    </Column>
    <H2>Scrollbar</H2>
    <Column lgWidth={6}>
        <TextBlock style={{ height: 100, overflowY: "auto" }}>
            <Scrollbar>
                This is a text block<br />
            The size has been limited to 100 pixels<br />
            The &lt;Scrollbar&gt; element was placed inside it<br />
            And then some content put inside that scrolled area<br />
            You have to scroll to see this!<br />
            Hello from below the fold!
        </Scrollbar>
        </TextBlock>
    </Column>
    <Column lgWidth={6}>
        <TextBlock style={{ height: 100, overflowY: "auto" }}>
            <Scrollbar primary>
                This is the same demo as before<br />
            But this is a primary scrollbar now<br />
            There should usually only be a single primary scrollbar<br />
            And that's the one on the right of the page<br />
            You have to scroll to see this!<br />
            Hello from below the fold!
        </Scrollbar>
        </TextBlock>
    </Column>
    <HR />
    <H2>Tabbed notebook</H2>
    <TabbedView>
        <Tab label={"Tab 1"}>
            Welcome to my tabbed notebook<br />
            You can put anything you want here.
        </Tab>
        <Tab label={"Tab 2"}>
            This is a spicy
        </Tab>
    </TabbedView>
    <HR />
    <H2>Tables</H2>
    <Table headings={["Header 1", "Header 2", "Header 3"]} data={[
        ["Row 1, cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
        ["Row 2, cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
        ["Row 3, cell 1", "Row 3, Cell 2", "Row 3, Cell 3", { type: "primary" }],
        ["Row 4, cell 1", "Row 4, Cell 2", "Row 4, Cell 3", { type: "secondary" }],
        ["Row 5, cell 1", "Row 5, Cell 2", "Row 5, Cell 3", { type: "success" }],
        ["Row 6, cell 1", "Row 6, Cell 2", "Row 6, Cell 3", { type: "info" }],
        ["Row 7, cell 1", "Row 7, Cell 2", "Row 7, Cell 3", { type: "warning" }],
        ["Row 8, cell 1", "Row 8, Cell 2", "Row 8, Cell 3", { type: "danger" }],
    ]} />
    <HR />
    <H2>Trees</H2>
    <TreeWrap>
        <Tree name="Folder">
            <TreeValue name="Read-only" value="yes" />
            <Tree name="Nested folder">
                <TreeValue name="Deeper value" value="value" />
            </Tree>
        </Tree>
        <Tree name="Open folder" startOpen>
            <TreeValue setValue={() => 0} name="Editable value" value="Edits won't actually occur" />
        </Tree>
    </TreeWrap>
    <HR />
    <H2>Card</H2>
    <Row>
        <Card header={"Card header"} title={"Card title"} light>Hi there!</Card>
    </Row>
    <Row>
        <Card header={"Card header"} title={"Card title"} primary>Hi there!</Card>
        <Card header={"Card header"} title={"Card title"} secondary>Hi there!</Card>
        <Card header={"Card header"} title={"Card title"} success>Hi there!</Card>
    </Row>
    <Row>
        <Card header={"Card header"} title={"Card title"} info>Hi there!</Card>
        <Card header={"Card header"} title={"Card title"} warning>Hi there!</Card>
        <Card header={"Card header"} title={"Card title"} danger>Hi there!</Card>
    </Row>
    <HR />
    <H2>Alerts</H2>
    <Row>
        <FlashText>This is a message for the user</FlashText>
    </Row>
    <Row>
        <FlashText primary>This is a <b>primary</b> message for the user</FlashText>
        <FlashText secondary>This is a <b>secondary</b> message for the user</FlashText>
        <FlashText success>This is a <b>succesful</b> message for the user</FlashText>
    </Row>
    <Row>
        <FlashText info>This is an <b>info</b> message for the user</FlashText>
        <FlashText warning>This is a <b>warning</b> message for the user</FlashText>
        <FlashText danger>This is a <b>danger</b> message for the user</FlashText>
    </Row>

    <Row>
        <FlashText title={"Hi there!"}>This is a message for the user</FlashText>
    </Row>
    <Row>
        <FlashText primary title={"Primary"}>This is a <b>primary</b> message for the user</FlashText>
        <FlashText secondary title={"Secondary"}>This is a <b>secondary</b> message for the user</FlashText>
        <FlashText success title={"Success"}>This is a <b>succesful</b> message for the user</FlashText>
    </Row>
    <Row>
        <FlashText info title={"Info"}>This is an <b>info</b> message for the user</FlashText>
        <FlashText warning title={"Warning"}>This is a <b>warning</b> message for the user</FlashText>
        <FlashText danger title={"Danger"}>This is a <b>danger</b> message for the user</FlashText>
    </Row>
    <HR />
    <H2>Misc</H2>
    <TextBlock>Text block</TextBlock>
    <Row>
        <Spinner />
    </Row>
    <Leader>This leads you on somewhere</Leader>
    <Leader sub={"but this time with a subtitle!"}>This leads you on somewhere</Leader>
    <p>This is text with <code>an inline snippet of code</code> inside it.</p>
    <SubtleText>Subtle text</SubtleText>
    <HR />
    <H2>Footer</H2>
    <Footer>
        <FootRow primary>
            <p>This is a primary row</p>
        </FootRow>
        <FootRow warning>
            <p>This is a warning row</p>
        </FootRow>
        <FootRow success>
            <p>You've seen these colours enough times.</p>
        </FootRow>
        <FootRow main>
            <FootCol title={"Hi there!"}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
            </FootCol>
            <FootCol title={"RACTF"}>
                <FootLink to={"#"}>Home</FootLink>
                <FootLink to={"#"}>About</FootLink>
                <FootLink to={"#"}>Get Started</FootLink>
                <FootLink to={"#"}>API Reference</FootLink>
            </FootCol>
            <FootCol title={"Get in Touch"}>
                <FootLink to={"#"}>Twitter</FootLink>
                <FootLink to={"#"}>Email</FootLink>
                <FootLink to={"#"}>Discord</FootLink>
            </FootCol>
        </FootRow>
        <FootRow center slim darken>
            &copy; 2020 RACTF
        </FootRow>
        <FootRow right danger>
            <p>These rows can go in any order!</p>
        </FootRow>
    </Footer>
</Row></Page>;
