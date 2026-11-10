from sklearn.base import BaseEstimator, TransformerMixin
from tokenizers import Tokenizer, models, trainers, pre_tokenizers, normalizers


class SubPalabras(BaseEstimator, TransformerMixin):
    def __init__(self, vocab_size=3000):
        self.vocab_size = vocab_size

    def fit(self, X, y=None):
        tok = Tokenizer(models.WordPiece(unk_token="[UNK]"))
        tok.normalizer = normalizers.Sequence(
            [normalizers.NFD(), normalizers.StripAccents(), normalizers.Lowercase()]
        )
        tok.pre_tokenizer = pre_tokenizers.Whitespace()
        trainer = trainers.WordPieceTrainer(
            vocab_size=self.vocab_size, special_tokens=["[UNK]"]
        )
        tok.train_from_iterator(list(X), trainer)
        self.tokenizer_ = tok
        return self

    def transform(self, X):
        return [" ".join(self.tokenizer_.encode(t).tokens) for t in X]