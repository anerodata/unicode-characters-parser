import ConverterSectionFieldset from './ConverterSectionFieldset.jsx'
import { useEffect, useState, useCallback } from 'react'
import fetchTranslation from './fetchTranslation.jsx'
const ConverterSection = (props) => {
  const [ defaultLangFirst, setDefaultLangFirst ] = useState('es')
  const [ defaultLangSecond, setDefaultLangSecond ] = useState('en')
  const [ defaultLangThird, setDefaultLangThird ] = useState('pt')
  const [ isLoading, setIsLoading ] = useState(false) 
  const [ inputValue, setInputValue ] = useState('')
  const debounceSetup = (callback, ms) => {
    let timerId
    return (...args) => {
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        callback(...args)
      }, ms)
    }
  }
  const debounceMs = 750
  const debounce = useCallback(
    debounceSetup(async (value) => {
      setIsLoading(true)
      const debounceMsBetweenFetchs = 500
      const translate = async (languageTarget) => {
        const obj = {
          query: value,
          source: defaultLangFirst,
          target: languageTarget
        }
        const res = await fetchTranslation(obj)
        return res
      }
      const secondLangRes = await translate(defaultLangSecond)
      await new Promise((resolve) => setTimeout(() => resolve()), debounceMsBetweenFetchs)
      const thirdLangRes = await translate(defaultLangThird)
      props.onTextToReplaceChange(secondLangRes.translatedText, thirdLangRes.translatedText)
      setIsLoading(false)
    }, debounceMs),
    []
  ) 
  useEffect(() => {
    if (inputValue !== '') {
      debounce(inputValue)
    }
  }, [inputValue])
  return (
    <section>
      <div>
        { defaultLangFirst }
        { defaultLangSecond }
        { defaultLangThird }
        <ConverterSectionFieldset
          title="Texto"
          onTextToReplaceChange={(value) => setInputValue(value)}
          defaultLang={defaultLangFirst}
          onLangChange={(value) => setDefaultLangFirst(value)}
          value={inputValue}
        />
        <ConverterSectionFieldset
          title="Texto con caracteres Unicode en notación de escape"
          value={props.secondValueModified}
          readOnly={true}
          defaultLang={defaultLangSecond}
          loading={isLoading}
          onLangChange={(value) => setDefaultLangSecond(value)}
        />
        <ConverterSectionFieldset
          title="Texto con caracteres Unicode en notación de escape"
          value={props.thirdValueModified}
          readOnly={true}
          defaultLang={defaultLangThird}
          loading={isLoading}
          onLangChange={(value) => setDefaultLangThird(value)}
        />
      </div>
    </section>
  )
}
export default ConverterSection
