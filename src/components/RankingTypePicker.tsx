import { AspectRatio, HStack, styled } from '../../styled-system/jsx'
const RANKING_TYPES: RankingType[] = ['yellow', 'red', 'green']
const RANKING_LABELS: Record<RankingType, string> = { green: 'vert', red: 'rouge', yellow: 'jaune' }

interface Props {
    selectedType: RankingType
    selectType: (type: RankingType) => void
}

const RankingTypePicker: React.FC<Props> = ({ selectedType, selectType }) => (
    <HStack justifyContent={'space-evenly'} cursor={'pointer'}>
        {RANKING_TYPES.map((rankingType, idx) => {
            const selected = rankingType === selectedType
            return (
                <HStack
                    key={idx}
                    onClick={() => selectType(rankingType)}
                    height={'100%'}
                    width={'100%'}
                    borderBottomWidth={selected ? 3 : 0}
                    borderBottomColor={
                        rankingType === 'yellow'
                            ? 'yellow.400'
                            : rankingType === 'red'
                            ? 'red.400'
                            : 'green.400'
                    }
                    justifyContent={'center'}
                    gap={0}>
                    <AspectRatio ratio={1} width={6}>
                        <img src={`./${rankingType}.png`} width={'100%'} height={'100%'} />
                    </AspectRatio>
                    <styled.span
                        key={rankingType}
                        color={'inherit'}
                        padding={2}
                        fontWeight={selected ? 'bold' : 'medium'}
                        textTransform={'uppercase'}>
                        {RANKING_LABELS[rankingType]}
                    </styled.span>
                </HStack>
            )
        })}
    </HStack>
)

export default RankingTypePicker
