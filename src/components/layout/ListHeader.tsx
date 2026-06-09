import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ListHeaderProps {
    title: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

interface SearchBarProps {
    title: string;
    searchValue: string | "";
    onChange?: (event: any) => void;
}



const ListHeader: React.FC<ListHeaderProps> = ({ title, onButtonClick }) => {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-sm text-muted-foreground">
                    Pengaturan {title}
                </p>
            </div>

            <Button size="sm" onClick={onButtonClick}>
                Tambah {title}
            </Button>
        </>
    )
}

const SearchBar: React.FC<SearchBarProps> = ({ title, searchValue, onChange }) => {
    const placeholder = `Mencari ${title}...`
    return (
        <Input
            placeholder={placeholder}
            value={searchValue}
            onChange={onChange}
            className="max-w-md"
        />
    )
}

export {
    ListHeader,
    SearchBar
}