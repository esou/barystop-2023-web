import { format, isBefore } from 'date-fns'
import * as React from 'react'
import { Flex, HStack, Square, styled } from '../../styled-system/jsx'

interface Props {
    dateList: string[]
    dateIdxSelected: number
    setDateIdxSelected: React.Dispatch<React.SetStateAction<number>>
}

const CustomDatePicker = ({ dateList, dateIdxSelected, setDateIdxSelected }: Props) => {
    return (
        <HStack justifyContent={'space-around'} alignItems={'center'} gap={0}>
            {dateList.map((itm, idx) => {
                const selected = dateIdxSelected === idx
                const disabled = isBefore(new Date(), new Date(itm))
                return (
                    <Square>
                        <styled.button
                            key={idx}
                            cursor={disabled ? 'wait' : 'pointer'}
                            onClick={() => setDateIdxSelected(idx)}
                            disabled={disabled}
                            bg={'white'}
                            boxShadow={selected ? 'lg' : 'sm'}
                            boxShadowColor={'black'}
                            borderRadius={'sm'}
                            width={'100%'}>
                            <Flex
                                borderTopRadius={'sm'}
                                bg={disabled ? 'black' : selected ? 'red.600' : 'red.800'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                paddingX={1}>
                                <styled.span
                                    textTransform={'uppercase'}
                                    color="white"
                                    fontSize={'xs'}>
                                    {format(new Date(itm), 'MMM')}
                                </styled.span>
                            </Flex>
                            <Flex
                                borderBottomRadius={'sm'}
                                bg={selected ? 'white' : 'stone.100'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                paddingX={1}>
                                <styled.span>{format(new Date(itm), 'dd')}</styled.span>
                            </Flex>
                        </styled.button>
                    </Square>
                )
            })}
        </HStack>
    )
}
export default CustomDatePicker
