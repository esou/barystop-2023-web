declare type RootScreen = ({ screen }: { screen: string }) => React.Node

interface ScreenDefinition {
    name: string
    screen: RootScreen
    path: string
    params?: { [key: string]: any }
}
